import { TableEvaluation } from "./evaluate-table";
import { Rule } from "./rule";
import { Value } from "./value";
export declare class Table {
    private varNames;
    private rules;
    private cachedEvaluation?;
    constructor(varNames: string[]);
    addRule(rule: Rule): void;
    renameVar(oldName: string, newName: string): void;
    addVar(varName: string): void;
    setCondition(varName: string, ruleNum: number, val: Value): void;
    evaluate(): TableEvaluation;
}
//# sourceMappingURL=table.d.ts.map