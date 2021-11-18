import { Rule } from "..";
import { Value } from "../model/value";

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

// This makes a strong assumption taht both rules have the same action!
export const canBeCombined = (a: Rule, b: Rule): boolean => {
    if (a.length !== b.length) {
        throw new Error("Mis matched rule lengths!");
    }
    let conflicts = 0;

    for (let i = 0; i < a.length; i++) {
        const ar = a[i];
        const br = b[i];
        if (ar !== ANY && br !== ANY && ar !== br) {
            conflicts++;
        }
        if (conflicts > 1) {
            return false;
        }
    }

    return true;
}

// NOTE: Does not check to see if they *can* be combined
const _combine = (a: Rule, b: Rule): Rule => {
    if (a.length !== b.length) throw new Error("Rule length mis match!");
    return a.map((aCond, idx) => {
        const bCond = b[idx];
        if (aCond === bCond) return aCond;
        return ANY;
    })
};

export const combine = (...rules: Rule[]) => {
    if (rules.length < 2) return rules[0];
    return rules.slice(1)
        .reduce((rule, current) => _combine(rule, current), rules[0]);
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

export const equal = (a: Rule, b: Rule): boolean =>
    a.length === b.length && a.findIndex((c, i) => c !== b[i]) < 0;