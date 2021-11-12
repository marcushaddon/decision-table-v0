import { Rule, SimpleRule } from "./rule";
export declare type DecisionTable = {
    rules: Rule[];
    varNames: string[];
    actions: string[];
    ruleActions: string[];
};
declare type UnmetCondition = SimpleRule;
declare type RedundantlyCoveredAction = {
    action: string;
    rules: Rule[];
    ruleIdxs: number[];
    simplified: Rule;
};
export declare type TableEvaluation = {
    uncoveredConditions: UnmetCondition[];
    conflicts: number[][];
    redundantRules: RedundantlyCoveredAction[];
    incompleteRules: Rule[];
    isSound: boolean;
};
export declare const evaluateTable: ({ rules, actions, ruleActions }: DecisionTable) => TableEvaluation;
export {};
//# sourceMappingURL=evaluate-table.d.ts.map