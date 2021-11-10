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
    addRule(rule: UnorderedRule): void;
    renameVar(oldName: string, newName: string): void;
    addVar(varName: string): void;
    setCondition(ruleNum: number, varName: string, val: Value): void;
    addAction(name: string): void;
    assignAction(ruleIdx: number, actionIdx: number): void;
    evaluate(): TableEvaluation;
    get state(): DecisionTable;
}
//# sourceMappingURL=table.d.ts.map