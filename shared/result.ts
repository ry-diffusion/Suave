export type Type<T = any> = new (...args: any[]) => T;

/**
 * Base interface for Result types, providing common methods for handling success and error cases.
 *
 * @template V The value type for a successful result.
 * @template E The error type for a failed result.
 * @template BT Boolean type indicating if this is an error (true) or success (false).
 */
interface ResultBase<V, E, BT extends boolean> {
	/**
	 * Assert a condition on the value. If the condition fails, returns an Err with the provided error.
	 *
	 * @param callback Function to test the value.
	 * @param error Error to return if assertion fails.
	 * @returns This result or an Err if assertion fails.
	 */
	assert(callback: (data: V) => boolean, error: Error): this;

	/**
	 * Assert a condition on the value. If the condition fails, returns an Err with the provided error.
	 *
	 * @param callback Function to test the value.
	 * @param error Error to return if assertion fails.
	 * @returns This result or an Err if assertion fails.
	 */
	assert(callback: (data: V) => boolean, error: (data: V) => Error): this;

	/**
	 * Unwraps the value if Ok, otherwise throws the error.
	 * @returns The value if Ok.
	 * @throws The error if Err.
	 */
	unwrap(): BT extends true ? never : V;

	/**
	 * Unwraps the value if Ok, otherwise returns the provided default value.
	 * @param defaultValue The value to return if this is an Err.
	 * @returns The value or the default value.
	 */
	unwrapOr(defaultValue: V): V;

	/**
	 * If Err, calls the callback with the error. Returns this for chaining.
	 * @param callback Function to handle the error.
	 * @returns This result.
	 */
	orElse(callback: (error: E) => void): this;

	/**
	 * If Err, throws the provided error. Otherwise returns this for chaining.
	 * @param error The error to throw if this is an Err.
	 * @returns This result if Ok.
	 * @throws The provided error if Err.
	 */
	orElseThrow(error: E): this;

	/**
	 * If Ok, maps the value using the callback and returns a new Result. If Err, propagates the error.
	 * @param callback Function to map the value.
	 * @returns A new Result with the mapped value or the original error.
	 */
	let<MV>(callback: (data: V) => MV): Result<MV, E>;

	/**
	 * If Ok, calls the callback with the value for side effects. Returns this for chaining.
	 * @param callback Function to call with the value.
	 * @returns This result.
	 */
	also(callback: (data: V) => void): this;

	/**
	 * If Err and error is instance of errorType, maps the error using the callback and returns a new Err. Otherwise returns this.
	 * @param error Type of error to match.
	 * @param callback Function to map the error.
	 * @returns A new Result with the mapped error or this result.
	 */
	letError<ME>(error: Type<ME>, callback: (error: ME) => ME): Result<V, ME>;

	/**
	 * If Ok, calls the async callback with the value for side effects. Returns a Promise of this for chaining.
	 * @param callback Async function to call with the value.
	 * @returns Promise of this result.
	 */
	alsoAsync(callback: (data: V) => Promise<void>): Promise<this>;

	/**
	 * Async variant of let. If Ok, maps the value using the async callback and returns a new Result Promise. If Err, propagates the error.
	 */
	letAsync<MV>(callback: (data: V) => Promise<MV>): Promise<Result<MV, E>>;

	/**
	 * Async variant of orElse. If Err, calls the async callback with the error. Returns a Promise of this for chaining.
	 */
	orElseAsync(callback: (error: E) => Promise<void>): Promise<this>;

	/**
	 * Async variant of orElseThrow. If Err, throws the provided error asynchronously. Otherwise returns a Promise of this for chaining.
	 */
	orElseThrowAsync(error: E): Promise<this>;

	/**
	 * Async variant of assert. If Ok, asserts the async condition on the value. If the condition fails, returns an Err with the provided error.
	 */
	assertAsync(
		callback: (data: V) => Promise<boolean>,
		error: Error | ((data: V) => Error),
	): Promise<this>;

	/**
	 * Async variant of letError. If Err and error is instance of errorType, maps the error using the async callback and returns a new Err. Otherwise returns a Promise of this.
	 */
	letErrorAsync<ME>(
		error: Type<ME>,
		callback: (error: E) => Promise<ME>,
	): Promise<Result<V, ME>>;
}

/**
 * Represents a failed result.
 * @template E The error type.
 * @template V The value type (unused for Err).
 */
export interface Err<E, V = unknown> extends ResultBase<V, E, true> {
	/** Always true for Err */
	error: true;
	/** The error value */
	data: E;
}

/**
 * Represents a successful result.
 * @template V The value type.
 * @template E The error type (unused for Ok).
 */
export interface Ok<V, E = never> extends ResultBase<V, E, false> {
	/** Always false for Ok */
	error: false;
	/** The success value */
	data: V;
}

/**
 * A type representing either a successful (Ok) or failed (Err) result.
 * @template V The value type for Ok.
 * @template E The error type for Err.
 */
export type Result<V, E> = Err<E, V> | Ok<V, E>;

/**
 * Internal factory for creating Result objects with attached methods.
 * @private
 */
function ResultFactory<E, V, T extends boolean>(
	error: T,
	data: T extends true ? E : V,
): Result<V, E> {
	// We'll create a new object for each result, attaching methods each time
	const result: any = {
		error: error as T,
		data,
	};

	result.unwrap = function () {
		if (this.error) {
			throw this.data;
		}
		return this.data;
	};

	result.unwrapOr = function (defaultValue: V) {
		if (this.error) {
			return defaultValue;
		}
		return this.data;
	};

	result.orElse = function (callback: (error: E) => void) {
		if (this.error) {
			callback(this.data as E);
		}
		return this;
	};

	result.orElseThrow = function (error: E) {
		if (this.error) {
			throw error;
		}
		return this;
	};

	result.let = function <MV>(callback: (data: V) => MV): Result<MV, E> {
		if (!this.error) {
			try {
				const newData = callback(this.data as V);
				return Ok<MV, E>(newData);
			} catch (error) {
				return Err<E, MV>(error as E);
			}
		}
		return Err<E, MV>(this.data as E);
	};

	result.also = function (callback: (data: V) => void) {
		if (!this.error) {
			callback(this.data as V);
		}
		return this;
	};

	result.alsoAsync = async function (callback: (data: V) => Promise<void>) {
		if (!this.error) {
			await callback(this.data as V);
		}
		return this;
	};

	result.letError = function <ME>(
		errorType: Type<ME>,
		callback: (error: E) => ME,
	): Result<V, ME> {
		if (this.error && this.data instanceof errorType) {
			const newData = callback(this.data as E);
			return Err<ME, V>(newData);
		}
		return this as unknown as Result<V, ME>;
	};

	result.assert = function (
		callback: (data: V) => boolean,
		error: Error | ((data: V) => Error),
	) {
		if (!this.error && !callback(this.data)) {
			return Err<Error, V>(
				typeof error === "function" ? error(this.data) : error,
			);
		}
		return this;
	};

	result.letAsync = async function <MV>(
		callback: (data: V) => Promise<MV>,
	): Promise<Result<MV, E>> {
		if (!this.error) {
			try {
				const newData = await callback(this.data as V);
				return Ok<MV, E>(newData);
			} catch (error) {
				return Err<E, MV>(error as E);
			}
		}
		return Err<E, MV>(this.data as E);
	};

	result.assertAsync = async function (
		callback: (data: V) => Promise<boolean>,
		error: Error | ((data: V) => Error),
	) {
		if (!this.error && !(await callback(this.data))) {
			return Err<Error, V>(
				typeof error === "function" ? error(this.data) : error,
			);
		}
		return this;
	};

	result.orElseAsync = async function (callback: (error: E) => Promise<void>) {
		if (this.error) {
			await callback(this.data as E);
		}
		return this;
	};

	result.orElseThrowAsync = async function (error: E) {
		if (this.error) {
			throw error;
		}
		return this;
	};

	result.letErrorAsync = async function <ME>(
		errorType: Type<ME>,
		callback: (error: E) => Promise<ME>,
	): Promise<Result<V, ME>> {
		if (this.error && this.data instanceof errorType) {
			const newData = await callback(this.data as E);
			return Err<ME, V>(newData);
		}
		return this as unknown as Result<V, ME>;
	};

	return result as Result<V, E>;
}

/**
 * Wrap a normal (synchronous) function into a new function that returns a Result object with the return value, or an error.
 * Note: If you want to create a wrapped function for an asynchronous function, see {@link wrapAsync}.
 *
 * @example
 *   const safeParse = wrap(JSON.parse);
 *   const result = safeParse('{"a":1}');
 *   if (!result.error) { console.log(result.data); }
 *
 * @param input The input function
 * @returns {(...args: Parameters<T>) => Result<ReturnType<T>, Error>} A function that returns a Result.
 */
export function wrap<T extends (...args: any[]) => any>(
	input: T,
): (...args: Parameters<T>) => Result<ReturnType<T>, Error> {
	return (...args: Parameters<T>) => {
		try {
			return Ok(input(...args));
		} catch (error) {
			return Err(error as Error);
		}
	};
}

/**
 * Wrap an asynchronous function into a new function that returns a Result object with the resolved value, or an error.
 * Note: If you want to create a wrapped result for an already created promise, see {@link wrapPromise}.
 *
 * @example
 *   const safeFetch = wrapAsync(fetch);
 *   const result = await safeFetch('https://example.com');
 *   if (!result.error) { console.log(result.data); }
 *
 * @param input The input async function
 * @returns {(...args: Parameters<T>) => Promise<Result<RT, Error>>} A function that returns a Result promise.
 */
export function wrapAsync<
	T extends (...args: any[]) => Promise<RT>,
	RT = ReturnType<T> extends Promise<infer U> ? U : never,
>(input: T): (...args: Parameters<T>) => Promise<Result<RT, Error>> {
	return async (...args: Parameters<T>) => {
		try {
			return Ok(await input(...args));
		} catch (error) {
			return Err(error as Error);
		}
	};
}

/**
 * Wrap an existing promise as a Result, to handle the error properly.
 * This promise NEVER throws.
 *
 * @example
 *   const result = await wrapPromise(fetch('https://example.com'));
 *   if (!result.error) { console.log(result.data); }
 *
 * @param promise The promise to handle
 * @returns {Promise<Result<T, TE>>} A promise that resolves to a Result.
 */
export async function wrapPromise<T, TE extends Error>(
	promise: Promise<T>,
): Promise<Result<T, TE>> {
	try {
		const result = await promise;

		return Ok(result);
	} catch (error: unknown) {
		return Err(error as TE);
	}
}

/**
 * Create an Err result.
 * @param data The error value.
 * @returns {Err<E, V>} An Err result.
 */
export function Err<E, V = never>(data: E) {
	return ResultFactory<E, V, true>(true, data);
}

/**
 * Create an Ok result.
 * @param data The success value.
 * @returns {Ok<V, E>} An Ok result.
 */
export function Ok<V, E = never>(data: V) {
	return ResultFactory<E, V, false>(false, data);
}
