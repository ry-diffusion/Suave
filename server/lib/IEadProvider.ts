import { PromiseResult, Result } from "../../shared/result";

export interface IEadProvider<TAuthSchema, TAuthContext, TAssignmentType> {
    authenticate(authSchema: TAuthSchema): PromiseResult<TAuthContext>;
    getAssignments(authContext: TAuthContext): PromiseResult<TAssignmentType[]>;
} 