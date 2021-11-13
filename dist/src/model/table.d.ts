import { DecisionTable, TableEvaluation } from "./evaluate-table";
import { Value } from "./value";
export declare type UnorderedRule = {
    value: Value;
    varName: string;
}[];
export declare class Table {
    private table;
    private cachedEvaluation?;
    constructor(varNames?: string[]);
    addRule(rule: UnorderedRule, action?: string): Table;
    deleteRule(num: number): Table;
    renameVar(oldName: string, newName: string): Table;
    addVar(varName: string): Table;
    deleteVar(varName: string): Table;
    setCondition(ruleNum: number, varName: string, val: Value): Table;
    addAction(name: string): Table;
    renameAction(oldName: string, newName: string): Table;
    assignAction(ruleIdx: number, action: string): Table;
    simplify(): Table;
    simplifyRules(...idxs: number[]): Table;
    evaluate(): TableEvaluation;
    get state(): DecisionTable;
}
//# sourceMappingURL=table.d.ts.map