import { PubSub } from "./pub-sub";
import { Table, UnorderedRule } from "./table";
import { DecisionTable, TableEvaluation } from "./evaluate-table";
import { Value } from "..";

type EventNames = "evaluated";

export interface IDecisionTable {
    addRule(rule: UnorderedRule): Table;
    deleteRule(num: number): Table;
    renameVar(oldName: string, newName: string): Table;
    // deleteAction(action: string): Table;
    renameAction(oldName: string, newName: string): Table;
    addVar(varName: string): Table;
    deleteVar(varName: string): Table;
    setCondition(num: number, varName: string, val: Value): Table;
    addAction(name: string): Table;
    assignAction(rule: number, action: string): Table;
    evaluate(): TableEvaluation;
    simplify(): Table;
    simplifyRules(...idxs: number[]): Table;
    state: DecisionTable;
}

export class PubSubTable {
    /**
     * init table
     * init pub sub of appropriate types
     * forward table/pub sub methods
     */
    constructor(
        private dt: IDecisionTable = new Table(),
        private ps: PubSub = new PubSub<EventNames, TableEvaluation>()
    ) {}
    private broadcast() {
        const evaluation = this.dt.evaluate();
        this.ps.emit("evaluated", evaluation);
    }
    /**
     * Forward Table methods, TODO: evaulate and maybe broadcast
     */
    public addRule(rule: UnorderedRule) {
        this.dt.addRule(rule);
        this.broadcast();
        return this;
    }

    public deleteRule(num: number) {
        this.dt.deleteRule(num);
        this.broadcast();
        return this;
    }

    public renameVar(old: string, newName: string) {
        this.dt.renameVar(old, newName);
        this.broadcast();
        return this;
    }

    public addVar(varName: string) {
        this.dt.addVar(varName);
        this.broadcast();
        return this;
    }

    public renameAction(oldName: string, newName: string) {
        this.dt.renameAction(oldName, newName);
        this.broadcast();
        return this;
    }

    public setCondition(row: number, varName: string, value: Value) {
        this.dt.setCondition(row, varName, value);
        this.broadcast();
        return this;
    }

    public addAction(name: string) {
        this.dt.addAction(name);
        this.broadcast();
        return this;
    }

    public assignAction(rule: number, action: string) {
        this.dt.assignAction(rule, action);
        this.broadcast();
        return this;
    }

    public simplifyRules(...idxs: number[]) {
        this.dt.simplifyRules(...idxs);
        this.broadcast;
        return this;
    }

    public simplify() {
        this.dt.simplify();
        this.broadcast;
        return this;
    }

    /**
     * Forward pubsub methods
     */
    public onEvaluated(cb: (data: TableEvaluation) => void): number {
        return this.ps.on("evaluated", cb);
    }

    public cancel(id: number) {
        return this.ps.cancel(id);
    }

    public get state(): DecisionTable {
        return this.dt.state;
    }
}