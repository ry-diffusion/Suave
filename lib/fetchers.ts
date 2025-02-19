import {ApiResponse, ApiResponseError, ApiResponseStatus} from "@/types/api";

class ApiError extends Error {
    constructor(public response: ApiResponseError) {
        super(response.message);
    }
}

export async function fetchNativeJSON<JSON = unknown>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<JSON> {
    const response = await fetch(input, {
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        credentials: "include",
        ...init,
    }).then((res) => res.json());

    const jResponse = response as ApiResponse<JSON>;
    if (jResponse.status != ApiResponseStatus.Ok)
        throw new ApiError(response as ApiResponseError);
    return response;
}

export async function fetchJson<JSON = unknown>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<JSON> {
    return await fetch(input, {
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        credentials: "include",
        ...init,
    }).then((res) => res.json());
}
