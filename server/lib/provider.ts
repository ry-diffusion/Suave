import type { MoodleApiClient } from "@webhare/moodle-webservice";
import { PromiseResult, Result } from "../../shared/result";

export interface IAssignment {
  id: string | number;
  name: string;
  dueDate?: Date;
  [key: string]: unknown;
}

export interface IIdentity {
  avatarUrl: string;
  name: string;
  hasAlternativeIdentity?: boolean;
}

// This error is thrown when the provider needs to re-login
// It is used to indicate that the user should be redirected to the login page
export class ShouldReloginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShouldReloginError";
  }
}

export interface IProvider<TAuthSchema, TAuthContext> {
  login(creds: TAuthSchema): PromiseResult<TAuthContext>;
  getIdentity(): Promise<IIdentity>;
  alternateIdentity(): Promise<IIdentity>;
  // Why? Some providers may need to restore auth with different credentials (e.g. too short refresh token, so we need to re-login)
  restoreAuth(authContext: TAuthContext, creds: TAuthSchema): void | Promise<void>;
  getEadAssignments(): Promise<Result<IAssignment[]>>;
}