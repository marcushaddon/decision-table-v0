import { PubSub } from "./pub-sub";
import { UnorderedRule } from "./table";
import { DecisionTable, TableEvaluation } from "./evaluate-table";
import { Value } from "..";
export interface IDecisionTable {
    addRule(rule: UnorderedRule): void;
    renameVar(oldName: string, newName: string): void;
    addVar(varName: string): void;
    setCondition(num: number, varName: string, val: Value): void;
    addAction(name: string): void;
    assignAction(rule: number, action: number): void;
    evaluate(): TableEvaluation;
    state: DecisionTable;
}
export declare class PubSubTable {
    private dt;
    private ps;
    /**
     * init table
     * init pub sub of appropriate types
     * forward table/pub sub methods
     */
    constructor(dt?: IDecisionTable, ps?: PubSub);
    private broadcast;
    /**
     * Forward Table methods, TODO: evaulate and maybe broadcast
     */
    addRule(rule: UnorderedRule): void;
    renameVar(old: string, newName: string): void;
    addVar(varName: string): void;
    setCondition(row: number, varName: string, value: Value): void;
    addAction(name: string): void;
    assignAction(rule: number, action: number): void;
    /**
     * Forward pubsub methods
     */
    onEvaluated(cb: (data: TableEvaluation) => void): number;
    cancel(id: number): void;
    get state(): DecisionTable;
}
//# sourceMappingURL=pub-table.d.ts.map