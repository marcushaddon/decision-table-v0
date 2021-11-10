import { Rule } from "..";
import { Value } from "..";

const { ANY, UNKNOWN } = Value;

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

export function* range(n: number, m?: number): Generator<number, void, void> {
    let i = (typeof m === 'number') ? n : 0;
    const end = (typeof m === 'number') ? m : n;
    while (i < end) {
        yield i;
        i++
    }
}

export const overlap = (a: Rule, b: Rule): boolean => {
    if (a.length != b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (
            a[i] === ANY ||
            b[i] === ANY ||
            a[i] === b[i]
        ) continue;

        return false;
    }

    return true;
}

export class RuleGraph {
    private graph: { [ fromIdx: number ]: { [ toIdx: number ]: boolean } } = {};

    public addEdge(fromIdx: number, toIdx: number) {
        if (!(fromIdx in this.graph)) {
            this.graph[fromIdx] = { [toIdx]: true };
        } else if (!this.graph[fromIdx][toIdx]) {
            this.graph[fromIdx][toIdx] = true;
        }
    }

    public haveEdge(fromIdx: number, toIdx: number) {
        return (this.graph[fromIdx]?.[toIdx]) ||
            (this.graph[toIdx]?.[fromIdx]);
    }

    public edges() {
        return Object.entries(this.graph)
            .reduce((acc, [node, edges]) => {
                const expanded = Object.keys(edges).map(edge => [parseInt(node), parseInt(edge)]);
                return [
                    ...acc,
                    ...expanded
                ];
            }, [] as number[][])
    }

    public has(n: number): boolean {
        return n in this.graph;
    }
}
