import { DecisionTable, evaluateTable, TableEvaluation } from "./evaluate-table";
import { Rule, SimpleRule } from "./rule";
import { SimpleValue, Value } from "./value";

export class Table {
    private varNames: string[];
    private rules: DecisionTable = [];
    private cachedEvaluation?: TableEvaluation;
    constructor(varNames: string[]) {
        this.varNames = [ ...varNames ];
    };

    public addRule(rule: Rule) {
        const incomingVars = rule.map(cond => cond.variableName);

        const missingVars = this.varNames.filter(name => !incomingVars.includes(name));
        if (missingVars.length > 0) {
            throw new Error(`Incoming rule missing variable names: ${missingVars.join(", ")}`);
        }

        const unknownVars = incomingVars.filter(iv => !this.varNames.includes(iv));
        if (unknownVars.length > 0) {
            throw new Error(`Receieved unknown variable names: ${unknownVars.join(", ")}`);
        }

        const sorted: Rule = this.varNames.map(vn => rule.find(cond => cond.variableName === vn)!);
        
        this.rules.push(sorted);
        delete this.cachedEvaluation;
    }

    public renameVar(oldName: string, newName: string) {
        // Make sure oldName exists
        const oldIdx = this.varNames.indexOf(oldName);
        const oldExists = oldIdx > -1;
        if (!oldExists) {
            throw new Error(`Cannot rename unknown variable: ${oldName}`);
        }
        // Make sure newName doesnt exist
        const newExists = this.varNames.indexOf(newName) > -1;
        if (newExists) {
            throw new Error(`Cannot rename ${oldName} to existing variable name: ${newName}`);
        }
        // update varNames
        this.varNames[oldIdx] = newName;

        // update all rules with new names
        for (const rule of this.rules) {
            for (const cond of rule) {
                if (cond.variableName === oldName) {
                    cond.variableName = newName;
                }
            }
        }

        // bust cache
        delete this.cachedEvaluation;
    }

    public addVar(varName: string) {
        // make sure doesnt exist
        const exists = this.varNames.indexOf(varName) > -1;
        if (exists) {
            throw new Error(`Cannot overwrite variable name: ${varName}`);
        }
        // add to end of varNames
        this.varNames.push(varName);

        // add to all rules with value "NONE"
        for (const rule of this.rules) {
            rule.push({ variableName: varName, value: Value.UNKNOWN }); 
        }

        // bust cache
        delete this.cachedEvaluation;
    }

    public setCondition(varName: string, ruleNum: number, val: Value) {
        // make sure varName exists 
        const varIdx = this.varNames.indexOf(varName);
        if (varIdx === -1) {
            throw new Error(`Unkown var: ${varName}`);
        }
        // make sure ruleNum is valid
        if (ruleNum < 0 || ruleNum >= this.rules.length) {
            throw new Error(`No rule at index: ${ruleNum}`);
        }

        // set val
        this.rules[ruleNum][varIdx].value = val;
        // bust cache
        delete this.cachedEvaluation;
    }

        public evaluate(): TableEvaluation {
            // maybe return cached
            if (this.cachedEvaluation) return this.cachedEvaluation;
            // get eval
            this.cachedEvaluation = evaluateTable(this.rules);
            
            return this.cachedEvaluation;
        }


    // TODO: execute actions!
}
