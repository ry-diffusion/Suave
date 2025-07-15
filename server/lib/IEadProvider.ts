import { PromiseResult, Result } from "../../shared/result";

export interface IEadSiteInfo {
    profilePictureUrl?: string;
    name?: string;
}

export interface IEadProvider<TAuthSchema, TAuthContext, TAssignmentType> {
    authenticate(authSchema: TAuthSchema): PromiseResult<TAuthContext>;
    getSiteInfo(authContext: TAuthContext): PromiseResult<IEadSiteInfo>;
    getAssignments(authContext: TAuthContext): PromiseResult<TAssignmentType[]>;
} 