import type { Projetos, UserData } from "~~/shared/datatypes";
import type { Result } from "~~/shared/result";

export interface IInstitutionApiProvider<TInstitutionSchema, TAuthContext> {
  authenticate(
    authSchema: TInstitutionSchema
  ): Promise<Result<TAuthContext, Error>>;
  verifyToken(authContext: TAuthContext): Promise<Result<boolean, Error>>;
  refreshToken(authContext: TAuthContext): Promise<Result<TAuthContext, Error>>;
  getProjetos(authContext: TAuthContext): Promise<Result<Projetos, Error>>;
  getMyData(authContext: TAuthContext): Promise<Result<UserData, Error>>;
}
