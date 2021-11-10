import { PubSub } from "./pub-sub";
import { Table, UnorderedRule } from "./table";
import { DecisionTable, TableEvaluation } from "./evaluate-table";
import { Value } from "..";

type EventNames = "evaluated";

export interface IDecisionTable {
    addRule(rule: UnorderedRule): void;
    renameVar(oldName: string, newName: string): void;
    addVar(varName: string): void;
    setCondition(num: number, varName: string, val: Value): void;
    addAction(name: string): void;
    evaluate(): TableEvaluation;
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
    }

    public renameVar(old: string, newName: string) {
        this.dt.renameVar(old, newName);
        this.broadcast();
    }

    public addVar(varName: string) {
        this.dt.addVar(varName);
        this.broadcast();
    }

    public setCondition(row: number, varName: string, value: Value) {
        this.dt.setCondition(row, varName, value);
        this.broadcast();
    }

    public addAction(name: string) {
        this.dt.addAction(name);
        this.broadcast();
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