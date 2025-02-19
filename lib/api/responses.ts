import {ApiResponseError, ApiResponseStatus, KnownError} from "@/types/api";

export function buildErrReq(item: ApiResponseError) {
    return Response.json(item, {status: 400});
}

export function err(status: ApiResponseStatus, knownError: KnownError, message: string) {
    return buildErrReq({status, error: knownError, message});
}

export function ok<T>(data: T) {
    return Response.json({status: ApiResponseStatus.Ok, data});
}


export const moodleIssue = err.bind(null, ApiResponseStatus.GatewayError).bind(null, KnownError.MoodleIssue);
export const badRequest = err.bind(null, ApiResponseStatus.BadRequest).bind(null, KnownError.UserBadRequest);
export const unsupportedInstitution = err.bind(null, ApiResponseStatus.BadRequest).bind(null, KnownError.UnsupportedInstitution);