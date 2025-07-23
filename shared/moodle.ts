import { AppException } from "./errors";
import { tryFetchJson } from "./http";
import { PromiseResult } from "./result";

export function moodleFetchJson<T>(
	url: string,
	init?: RequestInit,
): PromiseResult<T> {
	return tryFetchJson<T>(url, init).ensure(
		// ugly, but it works
		(data) => !(data as any).error,
		(data) =>
			new AppException(`[MOODLE] ${(data as any).error}`, "MOODLE_ERROR"),
	);
}
