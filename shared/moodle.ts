import { AppException } from "./errors";
import { tryFetchJson } from "./http";
import { Err, Ok, type Result } from "./result";

export async function moodleFetchJson<T>(
	url: string,
	init?: RequestInit,
): Promise<Result<T, Error>> {
	const result = await tryFetchJson<T>(url, init);
	if (result.error && (result.data as any)?.error) {
		return Err(
			new AppException(
				`[MOODLE] ${(result.data as any).error}`,
				"MOODLE_ERROR",
			),
		);
	}
	return result;
}
