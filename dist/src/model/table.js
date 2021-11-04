"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const evaluate_table_1 = require("./evaluate-table");
const value_1 = require("./value");
class Table {
    constructor(varNames) {
        this.rules = [];
        this.varNames = [...varNames];
    }
    ;
    addRule(rule) {
        const incomingVars = rule.map(cond => cond.variableName);
        const missingVars = this.varNames.filter(name => !incomingVars.includes(name));
        if (missingVars.length > 0) {
            throw new Error(`Incoming rule missing variable names: ${missingVars.join(", ")}`);
        }
        const unknownVars = incomingVars.filter(iv => !this.varNames.includes(iv));
        if (unknownVars.length > 0) {
            throw new Error(`Receieved unknown variable names: ${unknownVars.join(", ")}`);
        }
        const sorted = this.varNames.map(vn => rule.find(cond => cond.variableName === vn));
        this.rules.push(sorted);
        delete this.cachedEvaluation;
    }
    renameVar(oldName, newName) {
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
    addVar(varName) {
        // make sure doesnt exist
        const exists = this.varNames.indexOf(varName) > -1;
        if (exists) {
            throw new Error(`Cannot overwrite variable name: ${varName}`);
        }
        // add to end of varNames
        this.varNames.push(varName);
        // add to all rules with value "NONE"
        for (const rule of this.rules) {
            rule.push({ variableName: varName, value: value_1.Value.UNKNOWN });
        }
        // bust cache
        delete this.cachedEvaluation;
    }
    setCondition(varName, ruleNum, val) {
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
    evaluate() {
        // maybe return cached
        if (this.cachedEvaluation)
            return this.cachedEvaluation;
        // get eval
        this.cachedEvaluation = (0, evaluate_table_1.evaluateTable)(this.rules);
        return this.cachedEvaluation;
    }
}
exports.Table = Table;
