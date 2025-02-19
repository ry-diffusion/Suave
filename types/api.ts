export enum ApiResponseStatus {
    Ok = 'ok',
    GatewayError = 'gateway_error',
    BadRequest = 'skill_issue'
}

export enum KnownError {
    Unknown = 'unknown',
    UserBadRequest = 'user_bad_request',
    ServerIssue = 'server_skill_issue',
    UnsupportedInstitution = 'unsupported_institution',
    MoodleIssue = 'moodle_issue'
}

export type ApiResponseError = {
    status: ApiResponseStatus,
    error: KnownError,
    message: string
}

export type ApiResponseOk<T> = {
    status: ApiResponseStatus,
    data: T
}


export type ApiResponse<T = void> = ApiResponseOk<T> | ApiResponseError