export const oneToManyCartesianProduct =
    <T extends unknown>(prefix: T[], seqs: T[][]): T[][] => seqs.map(
        seq => [ ...prefix, ...seq ]
    );

export function* fliterate<T>(nested: T[][]): Generator<[number, T], void, void> {
    for (let i = 0; i < nested.length; i++) {
        for (const item of nested[i]) {
            yield [ i, item ];
        }
    }
}

export function* range(n: number): Generator<number, void, void> {
    let i = 0;
    while (i < n) {
        yield i;
    }
}
