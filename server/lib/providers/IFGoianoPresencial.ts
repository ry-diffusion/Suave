import type { Projetos, UserData } from "~~/shared/datatypes";
import { AppException } from "~~/shared/errors";
import { Err, Ok, type Result } from "../../../shared/result";
import type {
  AuthContext,
  ClassicAuthSchema,
  IFGoianoPresencialCredentials,
  MoodleAssignment,
  MoodleAuthContext,
  SuapAuthContext,
} from "../../../types/moodle";
import type { IEadProvider } from "../IEadProvider";
import type { IInstitutionApiProvider } from "../IInstituitionApiProvider";
import { MoodleEadProvider } from "../MoodleEadProvider";
import {
  type IAssignment,
  type IIdentity,
  type IProvider,
  ShouldReloginError,
} from "../provider";
import { SuapApiProvider } from "../SuapApiProvider";

export class IFGoianoPresencialProvider
  implements IProvider<IFGoianoPresencialCredentials, AuthContext>
{
  private eadProvider: IEadProvider<
    ClassicAuthSchema,
    MoodleAuthContext,
    MoodleAssignment
  >;
  private apiProvider: IInstitutionApiProvider<
    ClassicAuthSchema,
    SuapAuthContext
  >;
  private authContext: AuthContext;

  constructor() {
    this.eadProvider = new MoodleEadProvider(
      "https://presencial.ifgoiano.edu.br/"
    );
    this.apiProvider = new SuapApiProvider("https://suap.ifgoiano.edu.br");
    this.authContext = {
      ead: null,
      api: null,
      creds: null,
    };
  }

  async refreshAuth(
    authContext: AuthContext
  ): Promise<Result<AuthContext, Error>> {
    const doRefresh = async () => {
      let suapRefreshed = false;
      let moodleRefreshed = false;
      let newApi: SuapAuthContext | null = null;
      let newEad: MoodleAuthContext | null = null;

      // SUAP: try refresh, if fails, try reauthenticate
      if (authContext.api) {
        const refreshResult = await this.apiProvider.refreshToken(
          authContext.api
        );
        if (!refreshResult.error) {
          newApi = refreshResult.data;
          suapRefreshed = true;
        } else {
          // Try reauthenticate
          if (authContext.ead) {
            const creds = {
              username: authContext.creds?.username,
              password: authContext.creds?.password,
            } as ClassicAuthSchema;
            const reauthResult = await this.apiProvider.authenticate(creds);
            if (!reauthResult.error) {
              newApi = reauthResult.data;
              suapRefreshed = true;
            }
          }
        }
      }

      // Moodle: try get identity, if fails, try reauthenticate
      if (authContext.ead) {
        const siteInfoResult = await this.eadProvider.getSiteInfo(
          authContext.ead
        );
        if (!siteInfoResult.error) {
          newEad = authContext.ead;
          moodleRefreshed = true;
        } else {
          const creds = {
            username: authContext.creds?.username,
            password: authContext.creds?.password,
          } as ClassicAuthSchema;
          const reauthResult = await this.eadProvider.authenticate(creds);
          if (!reauthResult.error) {
            newEad = reauthResult.data;
            moodleRefreshed = true;
          }
        }
      }

      if (!suapRefreshed && !moodleRefreshed) {
        return Err(
          new ShouldReloginError(
            "Both SUAP and Moodle refresh failed. User should re-login."
          )
        );
      }

      this.authContext = {
        creds: authContext.creds,
        ead: newEad || authContext.ead,
        api: newApi || authContext.api,
      };
      return Ok(this.authContext);
    };

    return doRefresh();
  }

  async login(
    creds: IFGoianoPresencialCredentials
  ): Promise<Result<AuthContext, Error>> {
    const eadResult = await this.eadProvider.authenticate(creds);
    const apiResult = await this.apiProvider.authenticate(creds);

    if (eadResult.error) return Err(eadResult.data);
    if (apiResult.error) return Err(apiResult.data);

    this.authContext = { creds, ead: eadResult.data, api: apiResult.data };
    return Ok(this.authContext);
  }

  async restoreAuth(authContext: AuthContext): Promise<void> {
    console.log(`Restoring auth for ${authContext.creds?.username}`);
    this.authContext = authContext;
  }

  async getEadAssignments(): Promise<Result<IAssignment[], Error>> {
    if (!this.authContext.ead)
      return Err(new Error("Not authenticated for EAD"));
    return this.eadProvider.getAssignments(this.authContext.ead);
  }

  async getIdentity(): Promise<IIdentity> {
    if (!this.authContext.ead)
      throw new AppException(
        "Você não está autenticado para o EAD",
        "NOT_AUTHENTICATED"
      );
    const siteInfoResult = await this.eadProvider.getSiteInfo(
      this.authContext.ead
    );

    const siteInfo = siteInfoResult.unwrap();

    if (!siteInfo.profilePictureUrl)
      throw new AppException(
        "Você é estranho, quem não usa foto de perfil em 2025?",
        "NO_PROFILE_PICTURE"
      );
    if (!siteInfo.name)
      throw new AppException(
        "Você é estranho, quem não tem nome em 2025?",
        "NO_NAME"
      );
    return {
      avatarUrl: siteInfo.profilePictureUrl!,
      name: siteInfo.name!,
      hasAlternativeIdentity: false,
    };
  }

  async alternateIdentity(): Promise<IIdentity> {
    throw new Error("Not implemented");
  }

  async getProjetos(): Promise<Result<Projetos, Error>> {
    if (!this.authContext.api)
      return Err(
        new AppException(
          "Você não está autenticado para o SUAP",
          "NOT_AUTHENTICATED"
        )
      );
    return this.apiProvider.getProjetos(this.authContext.api);
  }

  async getMyData(): Promise<Result<UserData, Error>> {
    if (!this.authContext.api)
      return Err(
        new AppException(
          "Você não está autenticado para o SUAP",
          "NOT_AUTHENTICATED"
        )
      );
    return this.apiProvider.getMyData(this.authContext.api);
  }
}
