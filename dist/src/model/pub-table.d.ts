import { PubSub } from "./pub-sub";
import { Table, UnorderedRule } from "./table";
import { DecisionTable, TableEvaluation } from "./evaluate-table";
import { Value, Rule } from "..";
export interface IDecisionTable {
    addRule(rule: UnorderedRule): Table;
    deleteRule(rule: Rule): Table;
    renameVar(oldName: string, newName: string): Table;
    renameAction(oldName: string, newName: string): Table;
    addVar(varName: string): Table;
    deleteVar(varName: string): Table;
    setCondition(num: number, varName: string, val: Value): Table;
    addAction(name: string): Table;
    assignAction(rule: number, action: string): Table;
    evaluate(): TableEvaluation;
    simplify(): Table;
    simplifyRules(...rules: Rule[]): Table;
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
    addRule(rule: UnorderedRule): this;
    deleteRule(rule: Rule): this;
    renameVar(old: string, newName: string): this;
    addVar(varName: string): this;
    renameAction(oldName: string, newName: string): this;
    setCondition(row: number, varName: string, value: Value): this;
    addAction(name: string): this;
    assignAction(rule: number, action: string): this;
    simplifyRules(...rules: Rule[]): this;
    simplify(): this;
    /**
     * Forward pubsub methods
     */
    onEvaluated(cb: (data: TableEvaluation) => void): number;
    cancel(id: number): void;
    get state(): DecisionTable;
}
//# sourceMappingURL=pub-table.d.ts.map