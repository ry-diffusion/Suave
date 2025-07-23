import { PromiseResult, Result } from "./result";

async function tryFetchImpl(
	url: string,
	init?: RequestInit,
): Promise<Result<Response>> {
	try {
		const response = await fetch(url, init);
		if (!response.ok) {
			return Result.fail<Response>(new Error(`HTTP ${response.status}`));
		}

		return Result.ok(response);
	} catch (err) {
		return Result.fail<Response>(
			err instanceof Error ? err : new Error("Unknown fetch error"),
		);
	}
}

export const tryFetchAsync = (url: string, init?: RequestInit) =>
	PromiseResult.from<Response>(tryFetchImpl(url, init));

export function tryFetchJson<T>(
	url: string,
	init?: RequestInit,
): PromiseResult<T> {
	return tryFetchAsync(url, init).bind(async (response) => {
		const data = await response.json();
		return Result.ok(data);
	});
}
