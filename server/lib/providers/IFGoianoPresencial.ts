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
    if (!this.authContext.ead) throw new Error("Not authenticated for EAD");
    throw new Error("Not implemented");
  }

  async alternateIdentity(): Promise<IIdentity> {
    throw new Error("Not implemented");
  }
}
