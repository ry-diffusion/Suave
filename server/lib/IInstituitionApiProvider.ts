import { PromiseResult } from "~~/shared/result";

export interface IInstitutionApiProvider<TInstitutionSchema, TAuthContext> {
    authenticate(authSchema: TInstitutionSchema): PromiseResult<TAuthContext>;
    verifyToken(authContext: TAuthContext): PromiseResult<boolean>;
    refreshToken(authContext: TAuthContext): PromiseResult<TAuthContext>;
}