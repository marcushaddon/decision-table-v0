import { Rule, SimpleRule } from "./rule";
export declare type DecisionTable = {
    rules: Rule[];
    varNames: string[];
    actions: string[];
    ruleActions: number[];
};
declare type UnmetCondition = SimpleRule;
declare type RedundantlyCoveredCondition = {
    condition: SimpleRule;
    rules: Rule[];
    ruleIdxs: number[];
};
declare type RedundantlyCoveredAction = {
    action: number;
    rules: Rule[];
    ruleIdxs: number[];
};
export declare type TableEvaluation = {
    uncoveredConditions: UnmetCondition[];
    conflicts: RedundantlyCoveredCondition[];
    redundantRules: RedundantlyCoveredAction[];
    incompleteRules: Rule[];
    isSound: boolean;
};
export declare const evaluateTable: ({ rules, actions, ruleActions }: DecisionTable) => TableEvaluation;
export {};
//# sourceMappingURL=evaluate-table.d.ts.map