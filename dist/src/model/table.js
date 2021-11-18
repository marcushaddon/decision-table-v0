"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const evaluate_table_1 = require("./evaluate-table");
const value_1 = require("./value");
const helpers_1 = require("../helpers");
class Table {
    constructor(varNames) {
        this.table = {
            rules: [],
            actions: [],
            ruleActions: [],
            varNames: [],
        };
        this.table.varNames = varNames ? [...varNames] : [];
    }
    ;
    addRule(rule, action) {
        if (this.table.varNames.length === 0) {
            this.table.varNames = rule.map(({ varName }) => varName);
        }
        const missingVars = this.table.varNames
            .filter(v => rule.findIndex(p => p.varName === v) === -1);
        if (missingVars.length > 0) {
            throw new Error(`Rule missing vars: ${missingVars.join(',')}`);
        }
        const extraVars = rule
            .filter(p => !this.table.varNames.includes(p.varName));
        if (extraVars.length > 0) {
            throw new Error(`Rule contains unknown var(s): ${extraVars.join(',')}`);
        }
        const varVals = rule
            .reduce((vals, { value, varName }) => {
            vals[varName] = value;
            return vals;
        }, {});
        const sorted = this.table.varNames
            .map(vn => varVals[vn]);
        this.table.rules.push(sorted);
        if (action)
            this.assignAction(this.table.rules.length - 1, action);
        delete this.cachedEvaluation;
        return this;
    }
    deleteRule(rule) {
        const idx = this.table.rules.findIndex(r => (0, helpers_1.equal)(r, rule));
        this.table.rules = [
            ...this.table.rules.slice(0, idx),
            ...this.table.rules.slice(idx + 1)
        ];
        return this;
    }
    renameVar(oldName, newName) {
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
        return this;
    }
    addVar(varName) {
        // make sure doesnt exist
        const exists = this.table.varNames.indexOf(varName) > -1;
        if (exists) {
            throw new Error(`Cannot overwrite variable name: ${varName}`);
        }
        // add to end of varNames
        this.table.varNames.push(varName);
        // add to all rules with value "NONE"
        for (const rule of this.table.rules) {
            rule.push(value_1.Value.UNKNOWN);
        }
        // bust cache
        delete this.cachedEvaluation;
        return this;
    }
    deleteVar(varName) {
        const idx = this.table.varNames.indexOf(varName);
        if (idx < 0)
            throw new Error(`Unknown varname: ${varName}`);
        this.table.varNames = [
            ...this.table.varNames.slice(0, idx),
            ...this.table.varNames.slice(idx + 1)
        ];
        this.table.rules = this.table.rules
            .map(rule => [
            ...rule.slice(0, idx),
            ...rule.slice(idx + 1),
        ]);
        this.table.ruleActions = [
            ...this.table.ruleActions.slice(0, idx),
            ...this.table.ruleActions.slice(idx + 1)
        ];
        delete this.cachedEvaluation;
        return this;
    }
    setCondition(ruleNum, varName, val) {
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
        return this;
    }
    addAction(name) {
        if (this.table.actions.includes(name)) {
            throw new Error(`action ${name} already exists`);
        }
        this.table.actions.push(name);
        delete this.cachedEvaluation;
        return this;
    }
    renameAction(oldName, newName) {
        if (!this.table.actions.includes(oldName))
            throw new Error(`Unknown action: ${oldName}`);
        if (this.table.actions.includes(newName))
            throw new Error(`Cannot rename ${oldName} to existing action: ${newName}`);
        const idx = this.table.actions.indexOf(oldName);
        this.table.actions[idx] = newName;
        this.table.ruleActions = this.table.ruleActions
            .map(ra => ra === oldName ? newName : ra);
        delete this.cachedEvaluation;
        return this;
    }
    assignAction(ruleIdx, action) {
        if (ruleIdx < 0 || ruleIdx > this.table.rules.length - 1) {
            throw new Error("Invalid rule idx");
        }
        if (!this.table.actions.includes(action)) {
            throw new Error(`Unknown action: ${action}`);
        }
        this.table.ruleActions[ruleIdx] = action;
        delete this.cachedEvaluation;
        return this;
    }
    simplify() {
        const { redundantRules } = this.evaluate();
        for (const { rules } of redundantRules) {
            this.simplifyRules(...rules);
        }
        return this;
    }
    simplifyRules(...rules) {
        const simplified = (0, helpers_1.combine)(...rules);
        rules.forEach(rule => {
            this.deleteRule(rule);
        });
        this.table.rules.push(simplified);
        delete this.cachedEvaluation;
        return this;
    }
    evaluate() {
        // maybe return cached
        if (this.cachedEvaluation)
            return this.cachedEvaluation;
        // get eval
        this.cachedEvaluation = (0, evaluate_table_1.evaluateTable)(this.table);
        return this.cachedEvaluation;
    }
    get state() {
        return this.table;
    }
}
exports.Table = Table;
