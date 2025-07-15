import type {
  MoodleAuthSchema,
  MoodleAuthContext,
  MoodleAssignment,
  IFGoianoPresencialCredentials,
  AuthContext,
} from "../../../types/moodle.d.ts";
import { MoodleEadProvider } from "../MoodleEadProvider";
import { IEadProvider } from "../IEadProvider";
import { IProvider, IAssignment, IIdentity } from "../provider";
import { PromiseResult, Result } from "../../../shared/result";
import { AppException } from "~~/shared/errors.js";

export class IFGoianoPresencialProvider implements IProvider<IFGoianoPresencialCredentials, AuthContext> {
  private eadProvider: IEadProvider<MoodleAuthSchema, MoodleAuthContext, MoodleAssignment>;
  private authContext: AuthContext;

  constructor() {
    this.eadProvider = new MoodleEadProvider("https://presencial.ifgoiano.edu.br");
    this.authContext = {
      ead: null,
    };
  }

  login(creds: IFGoianoPresencialCredentials): PromiseResult<AuthContext> {
    return this.eadProvider.authenticate({
      username: creds.username,
      password: creds.password,
    }).map((ead) => {
      this.authContext = { ead };
      return this.authContext;
    });
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
}
