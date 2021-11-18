import { Rule } from "..";
export declare const oneToManyCartesianProduct: <T extends unknown>(prefix: T[], seqs: T[][]) => T[][];
export declare function fliterate<T>(nested: T[][]): Generator<[number, T], void, void>;
export declare function range(n: number, m?: number): Generator<number, void, void>;
export declare const overlap: (a: Rule, b: Rule) => boolean;
export declare const canBeCombined: (a: Rule, b: Rule) => boolean;
export declare const combine: (...rules: Rule[]) => Rule;
export declare class RuleGraph {
    private graph;
    addEdge(fromIdx: number, toIdx: number): void;
    haveEdge(fromIdx: number, toIdx: number): boolean;
    edges(): number[][];
    has(n: number): boolean;
}
export declare const equal: (a: Rule, b: Rule) => boolean;
//# sourceMappingURL=index.d.ts.map