type ResultError = Error;

export class Result<T> {
    private constructor(
        public readonly isSuccess: boolean,
        public readonly value?: T,
        public readonly error?: Error
    ) { }

    public get isFailure(): boolean {
        return !this.isSuccess;
    }

    public static ok<T>(value: T): Result<T> {
        return new Result(true, value);
    }

    public static fail<T>(error: Error): Result<T> {
        return new Result<T>(false, undefined, error);
    }

    public tap(fn: (value: T) => void): Result<T> {
        if (this.isSuccess && this.value !== undefined) {
            fn(this.value);
        }
        return this;
    }

    public async tapAsync(fn: (value: T) => Promise<void>): Promise<Result<T>> {
        if (this.isSuccess && this.value !== undefined) {
            await fn(this.value);
        }
        return this;
    }

    public ensure(predicate: (value: T) => boolean, error: Error | ((value: T) => Error)): Result<T> {
        if (this.isFailure) {
            return this;
        };

        if (!predicate(this.value!)) {
            return Result.fail<T>(error instanceof Error ? error : error(this.value!));
        }

        return this;
    }

    public map<U>(fn: (value: T) => U): Result<U> {
        if (this.isFailure) return Result.fail<U>(this.error!);
        return Result.ok(fn(this.value!));
    }

    public handle<E extends Error>(errorType: new (...args: any[]) => E,
        callback: (error: E) => Result<T>): Result<T> {
        if (this.isFailure && this.error instanceof errorType) {
            return callback(this.error as E);
        }

        return this;
    }

    public async handleAsync<E extends Error>(errorType: new (...args: any[]) => E,
        callback: (error: E) => Promise<Result<T>>): Promise<Result<T>> {
        if (this.isFailure && this.error instanceof errorType) {
            return await callback(this.error as E);
        }
        return Promise.resolve(this);
    }

    public bind<U>(fn: (value: T) => Result<U>): Result<U> {
        if (this.isFailure) return Result.fail<U>(this.error!);
        return fn(this.value!);
    }

    public async bindAsync<U>(fn: (value: T) => Promise<Result<U>>): Promise<Result<U>> {
        if (this.isFailure) return Result.fail<U>(this.error!);
        return await fn(this.value!);
    }

    public match<U>(onSuccess: (value: T) => U, onFailure: (error: Error) => U): U {
        return this.isSuccess ? onSuccess(this.value!) : onFailure(this.error!);
    }

    with(fn: (result: Result<T>) => Result<T>): Result<T> {
        return fn(this);
    }

    withAsync(fn: (value: T) => Promise<Result<T>>): Promise<Result<T>> {
        return fn(this.value!);
    }
}

export class PromiseResult<T> {
    constructor(private readonly task: () => Promise<Result<T>>) { }

    static from<T>(promise: Promise<Result<T>>): PromiseResult<T> {
        return new PromiseResult(() => promise);
    }

    static ok<T>(value: T): PromiseResult<T> {
        return new PromiseResult(() => Promise.resolve(Result.ok(value)));
    }

    static fail<T>(error: Error): PromiseResult<T> {
        return new PromiseResult(() => Promise.resolve(Result.fail<T>(error)));
    }

    static all<T>(promises: PromiseResult<T>[]): PromiseResult<T[]> {
        return new PromiseResult(() => Promise.all(promises.map(p => p.task())).then(results => {
            if (results.some(result => result.isFailure)) {
                return Result.fail<T[]>(results.find(result => result.isFailure)!.error!);
            }
            return Result.ok(results.map(result => result.value!));
        }));
    }

    map<U>(fn: (value: T) => U): PromiseResult<U> {
        return new PromiseResult(() =>
            this.task().then(result => result.map(fn))
        );
    }

    bind<U>(fn: (value: T) => Promise<Result<U>>): PromiseResult<U> {
        return new PromiseResult(async () => {
            const result = await this.task();
            if (result.isFailure) return Result.fail<U>(result.error!);
            return PromiseResult.from(fn(result.value!));
        });
    }




    ensure(predicate: (value: T) => boolean, error: Error | ((value: T) => Error)): PromiseResult<T> {
        return new PromiseResult(() =>
            this.task().then(result => result.ensure(predicate, error))
        );
    }

    tap(fn: (value: T) => void): PromiseResult<T> {
        return new PromiseResult(() =>
            this.task().then(result => result.tap(fn))
        );
    }

    tapAsync(fn: (value: T) => Promise<void>): PromiseResult<T> {
        return new PromiseResult(() =>
            this.task().then(result => result.tapAsync(fn))
        );
    }

    match<U>(onSuccess: (value: T) => U, onFailure: (error: Error) => U): Promise<U> {
        return this.task().then(result => result.match(onSuccess, onFailure));
    }

    handle<E extends Error>(errorType: new (...args: any[]) => E,
        callback: (error: E) => Promise<Result<T>>): PromiseResult<T> {
        return new PromiseResult(() =>
            this.task().then(result => result.handleAsync(errorType, callback))
        );
    }

    with(fn: (result: Result<T>) => Result<T>): PromiseResult<T> {
        return new PromiseResult(async () => {
            const result = await this.task();
            return result.with(fn);
        });
    }

    async run(): Promise<Result<T>> {
        return await this.task();
    }

    // allow direct `await`
    then<TResult>(
        onfulfilled?: (value: Result<T>) => TResult | PromiseLike<TResult>,
        onrejected?: (reason: any) => TResult | PromiseLike<TResult>
    ): Promise<TResult> {
        return this.run().then(onfulfilled, onrejected);
    }

    toPromise(): Promise<T> {
        return this.run().then(result => result.value!);
    }
}
