import { tryFetchJson } from "./http";
import { AppException } from "./errors";
import { PromiseResult } from "./result";

export function suapFetchJson<T>(url: string, init?: RequestInit): PromiseResult<T> {
    return tryFetchJson<T>(url, init)
        .ensure(
            // ugly, but it works
            (data) => !(data as any).detail,
            (data) => new AppException(`[SUAP] ${(data as any).detail}`, "SUAP_ERROR")
        );
}
