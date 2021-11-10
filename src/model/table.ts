import { DecisionTable, evaluateTable, TableEvaluation } from "./evaluate-table";
import { Rule, SimpleRule } from "./rule";
import { SimpleValue, Value } from "./value";

export type UnorderedRule = { value: Value, varName: string }[];

export class Table {
    private table: DecisionTable = {
        rules: [],
        actions: [],
        ruleActions: [],
        varNames: [],
    };
    private cachedEvaluation?: TableEvaluation;
    constructor(varNames?: string[]) {
        this.table.varNames = varNames ? [ ...varNames ] : [];
    };

    public addRule(rule: UnorderedRule) {
        if (this.table.varNames.length === 0) {
            this.table.varNames = rule.map(({ varName }) => varName);
        }
        const missingVars = this.table.varNames
            .filter(v => rule.findIndex(p => p.varName === v) === -1);

        if (missingVars.length > 0) {
            throw new Error(`Rule missing vars: ${missingVars.join(',')}`);
        }
        
        const extraVars = rule
            .filter(p => !this.table.varNames.includes(p.varName))

        if (extraVars.length > 0) {
            throw new Error(`Rule contains unknown var(s): ${extraVars.join(',')}`);
        }

        const varVals = rule
            .reduce((vals, { value, varName }) => {
                vals[varName] = value;

                return vals;
            }, {} as { [ varName: string ]: Value })
        
        const sorted: Rule = this.table.varNames
            .map(vn => varVals[vn]);
        
        this.table.rules.push(sorted);
        delete this.cachedEvaluation;
    }

    public renameVar(oldName: string, newName: string) {
        // Make sure oldName exists
        const oldIdx = this.table.varNames.indexOf(oldName);
        const oldExists = oldIdx > -1;
        if (!oldExists) {
            throw new Error(`Cannot rename unknown variable: ${oldName}`);
        }
        // Make sure newName doesnt exist
        const newExists = this.table.varNames.indexOf(newName) > -1;
        if (newExists) {
            throw new Error(`Cannot rename ${oldName} to existing variable name: ${newName}`);
        }
        // update varNames
        this.table.varNames[oldIdx] = newName;

        // bust cache
        delete this.cachedEvaluation;
    }

    public addVar(varName: string) {
        // make sure doesnt exist
        const exists = this.table.varNames.indexOf(varName) > -1;
        if (exists) {
            throw new Error(`Cannot overwrite variable name: ${varName}`);
        }
        // add to end of varNames
        this.table.varNames.push(varName);

        // add to all rules with value "NONE"
        for (const rule of this.table.rules) {
            rule.push(Value.UNKNOWN); 
        }

        // bust cache
        delete this.cachedEvaluation;
    }

    public setCondition(ruleNum: number, varName: string, val: Value) {
        // make sure varName exists 
        const varIdx = this.table.varNames.indexOf(varName);
        if (varIdx === -1) {
            throw new Error(`Unkown var: ${varName}`);
        }
        // make sure ruleNum is valid
        if (ruleNum < 0 || ruleNum >= this.table.rules.length) {
            throw new Error(`No rule at index: ${ruleNum}`);
        }

        // set val
        this.table.rules[ruleNum][varIdx] = val;
        // bust cache
        delete this.cachedEvaluation;
    }

    public addAction(name: string) {
        if (this.table.actions.includes(name)) {
            throw new Error(`action ${name} already exists`);
        }

        this.table.actions.push(name);
        delete this.cachedEvaluation;
    }

    public assignAction(ruleIdx: number, actionIdx: number) {
        if (ruleIdx < 0 || ruleIdx > this.table.rules.length - 1) {
            throw new Error("Invalid rule idx");
        }

        if (actionIdx < 0 || actionIdx > this.table.actions.length - 1) {
            throw new Error("Invalid action idx");
        }

        this.table.ruleActions[ruleIdx] = actionIdx;
    }

    public evaluate(): TableEvaluation {
        // maybe return cached
        if (this.cachedEvaluation) return this.cachedEvaluation;
        // get eval
        this.cachedEvaluation = evaluateTable(this.table);
        
        return this.cachedEvaluation;
    }

    public get state(): DecisionTable {
        return this.table;
    }

    // TODO: execute actions!
}
