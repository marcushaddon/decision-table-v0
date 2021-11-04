import { Rule, SimpleRule } from "./rule";
export declare type DecisionTable = Rule[];
declare type UnmetCondition = SimpleRule;
declare type RedundantlyCoveredCondition = {
    condition: SimpleRule;
    rules: Rule[];
};
export declare type TableEvaluation = {
    uncoveredConditions: UnmetCondition[];
    conflicts: RedundantlyCoveredCondition[];
    incompleteRules: Rule[];
    isSound: boolean;
};
export declare const evaluateTable: (dt: DecisionTable) => TableEvaluation;
export {};
//# sourceMappingURL=evaluate-table.d.ts.map