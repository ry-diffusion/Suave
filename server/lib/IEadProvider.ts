import type { Result } from "../../shared/result";

export interface IEadSiteInfo {
	profilePictureUrl?: string;
	name?: string;
}

export interface IEadProvider<TAuthSchema, TAuthContext, TAssignmentType> {
	authenticate(authSchema: TAuthSchema): Promise<Result<TAuthContext, Error>>;
	getSiteInfo(authContext: TAuthContext): Promise<Result<IEadSiteInfo, Error>>;
	getAssignments(
		authContext: TAuthContext,
	): Promise<Result<TAssignmentType[], Error>>;
}
