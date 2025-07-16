import type {
  ClassicAuthSchema,
  MoodleAuthContext,
  MoodleAssignment,
  IFGoianoPresencialCredentials,
  AuthContext,
  SuapAuthContext,
} from "../../../types/moodle.d.ts";
import { MoodleEadProvider } from "../MoodleEadProvider";
import { IEadProvider } from "../IEadProvider";
import { IProvider, IAssignment, IIdentity } from "../provider";
import { PromiseResult, Result } from "../../../shared/result";
import { AppException } from "~~/shared/errors";
import { IInstitutionApiProvider } from "../IInstituitionApiProvider";
import { SuapApiProvider } from "../SuapApiProvider";
import { ShouldReloginError } from "../provider";
import { Projetos } from "~~/shared/datatypes";

export class IFGoianoPresencialProvider implements IProvider<IFGoianoPresencialCredentials, AuthContext> {
  private eadProvider: IEadProvider<ClassicAuthSchema, MoodleAuthContext, MoodleAssignment>;
  private apiProvider: IInstitutionApiProvider<ClassicAuthSchema, SuapAuthContext>;
  private authContext: AuthContext;

  constructor() {
    this.eadProvider = new MoodleEadProvider("https://presencial.ifgoiano.edu.br");
    this.apiProvider = new SuapApiProvider("https://suap.ifgoiano.edu.br");
    this.authContext = {
      ead: null,
      api: null,
      creds: null,
    };
  }

  refreshAuth(authContext: AuthContext): PromiseResult<AuthContext> {
    const doRefresh = async () => {
      let suapRefreshed = false;
      let moodleRefreshed = false;
      let newApi: SuapAuthContext | null = null;
      let newEad: MoodleAuthContext | null = null;

      // SUAP: try refresh, if fails, try reauthenticate
      if (authContext.api) {
        const refreshResult = await this.apiProvider.refreshToken(authContext.api).run();
        if (refreshResult.isSuccess) {
          newApi = refreshResult.value!;
          suapRefreshed = true;
        } else {
          // Try reauthenticate
          if (authContext.ead) {
            // Try to use username from EAD if available
            const creds = { username: authContext.creds?.username, password: authContext.creds?.password } as ClassicAuthSchema;
            // Password is not available, so reauth will likely fail, but try
            const reauthResult = await this.apiProvider.authenticate(creds).run();
            if (reauthResult.isSuccess) {
              newApi = reauthResult.value!;
              suapRefreshed = true;
            }
          }
        }
      }

      // Moodle: try get identity, if fails, try reauthenticate
      if (authContext.ead) {
        const siteInfoResult = await this.eadProvider.getSiteInfo(authContext.ead).run();
        if (siteInfoResult.isSuccess) {
          newEad = authContext.ead;
          moodleRefreshed = true;
        } else {
          // Try reauthenticate
          const creds = { username: authContext.ead.username, password: "" } as ClassicAuthSchema;
          // Password is not available, so reauth will likely fail, but try
          const reauthResult = await this.eadProvider.authenticate(creds).run();
          if (reauthResult.isSuccess) {
            newEad = reauthResult.value!;
            moodleRefreshed = true;
          }
        }
      }

      // If both fail, throw ShouldReloginError
      if (!suapRefreshed && !moodleRefreshed) {
        throw new ShouldReloginError("Both SUAP and Moodle refresh failed. User should re-login.");
      }

      // Update authContext with refreshed tokens if available
      this.authContext = {
        creds: authContext.creds,
        ead: newEad || authContext.ead,
        api: newApi || authContext.api,
      };
      return Result.ok(this.authContext);
    };

    return PromiseResult.from(doRefresh());
  }

  login(creds: IFGoianoPresencialCredentials): PromiseResult<AuthContext> {
    const doLogin = async () => {
      const eadResult = this.eadProvider.authenticate(creds).toPromise();
      const apiResult = this.apiProvider.authenticate(creds).toPromise();

      const [ead, api] = await Promise.all([eadResult, apiResult]);
      this.authContext = { creds, ead, api };
      return Result.ok(this.authContext);
    };

    return PromiseResult.from(doLogin());
  }

  async restoreAuth(authContext: AuthContext): Promise<void> {
    console.log(`Restoring auth for ${authContext.ead?.username}`);
    this.authContext = authContext;
  }

  async getEadAssignments(): Promise<Result<IAssignment[]>> {
    if (!this.authContext.ead) throw new Error("Not authenticated for EAD");
    return this.eadProvider.getAssignments(this.authContext.ead);
  }

  async getIdentity(): Promise<IIdentity> {
    if (!this.authContext.ead) throw new AppException("Você não está autenticado para o EAD", "NOT_AUTHENTICATED");
    return await this.eadProvider.getSiteInfo(this.authContext.ead)
      .ensure(
        (siteInfo) => !!siteInfo.profilePictureUrl,
        new AppException("Você é estranho, quem não usa foto de perfil em 2025?", "NO_PROFILE_PICTURE")
      )
      .ensure(
        (siteInfo) => !!siteInfo.name,
        new AppException("Você é estranho, quem não tem nome em 2025?", "NO_NAME")
      )
      .map((siteInfo) => ({
        avatarUrl: siteInfo.profilePictureUrl!,
        name: siteInfo.name!,
        hasAlternativeIdentity: false,
      })).toPromise();
  }

  async alternateIdentity(): Promise<IIdentity> {
    throw new Error("Not implemented");
  }


  getProjetos(): PromiseResult<Projetos> {
    if (!this.authContext.api) throw new AppException("Você não está autenticado para o SUAP", "NOT_AUTHENTICATED");
    return this.apiProvider.getProjetos(this.authContext.api);
  }
}
