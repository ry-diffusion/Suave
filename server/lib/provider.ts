import type { MoodleApiClient } from "@webhare/moodle-webservice";
import type { Projetos, UserData } from "~~/shared/datatypes";
import type { Result } from "../../shared/result";

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

export class ShouldReloginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShouldReloginError";
  }
}

export interface IProvider<TAuthSchema, TAuthContext> {
  login(creds: TAuthSchema): Promise<Result<TAuthContext, Error>>;
  getIdentity(): Promise<IIdentity>;
  alternateIdentity(): Promise<IIdentity>;
  restoreAuth(authContext: TAuthContext): void | Promise<void>;
  refreshAuth(authContext: TAuthContext): Promise<Result<TAuthContext, Error>>;
  getEadAssignments(): Promise<Result<IAssignment[], Error>>;
  getProjetos(): Promise<Result<Projetos, Error>>;
  getMyData(): Promise<Result<UserData, Error>>;
}
