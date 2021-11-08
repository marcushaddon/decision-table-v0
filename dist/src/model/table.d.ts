import { TableEvaluation } from "./evaluate-table";
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
    evaluate(): TableEvaluation;
}
//# sourceMappingURL=table.d.ts.map