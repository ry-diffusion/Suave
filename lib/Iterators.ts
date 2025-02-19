export function* chunkedBy<T>(iter: Iterable<T>, chunkSize: number): IterableIterator<T[]> {
    let chunk: T[] = [];
    for (const item of iter) {
        chunk.push(item);
        if (chunk.length === chunkSize) {
            yield chunk;
            chunk = [];
        }
    }
    if (chunk.length) {
        yield chunk;
    }
}

export function chunkedByToArray<T>(iter: Iterable<T>, chunkSize: number): T[][] {
    let res = chunkedBy(iter, chunkSize);
    return Array.from(res);
}