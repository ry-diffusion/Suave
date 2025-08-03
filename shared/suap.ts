import { AppException } from "./errors";
import { tryFetchJson } from "./http";
import { Err, Ok, type Result } from "./result";

export async function suapFetchJson<T>(
	url: string,
	init?: RequestInit,
): Promise<Result<T, Error>> {
	const result = await tryFetchJson<T>(url, init);
	if (result.error && (result.data as any)?.detail) {
		return Err(
			new AppException(`[SUAP] ${(result.data as any).detail}`, "SUAP_ERROR"),
		);
	}
	return result;
}
