"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTable = void 0;
const rule_1 = require("./rule");
const value_1 = __importDefault(require("./value"));
const evaluateTable = (dt) => {
    if (dt.length === 0) {
        return {
            isSound: false,
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules: []
        };
    }
    const incompleteRules = dt.filter(rule => rule.findIndex(cond => cond.value === value_1.default.UNKNOWN) > -1);
    if (incompleteRules.length > 0) {
        return {
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules,
            isSound: false,
        };
    }
    const allExpanded = dt.map(rule => (0, rule_1.expand)(rule));
    // seenVals is a lookup from "rules numeric vallue"
    // to the idx of every rule in the table that covers it
    const seenVals = allExpanded.reduce((seen, expansion, idx) => {
        expansion.forEach(rule => {
            const val = (0, rule_1.numVal)(rule);
            if (seen[val]) {
                seen[val].push(idx);
            }
            else {
                seen[val] = [idx];
            }
        });
        return seen;
    }, {});
    const highestPossibleValue = Math.pow(2, dt[0].length);
    const allnums = [...Array(highestPossibleValue)]
        .map((_, i) => i);
    const notSeen = allnums
        .filter(val => !(val in seenVals));
    const variableNames = dt[0].map(cond => cond.variableName);
    const toRules = notSeen
        .map((val) => (0, rule_1.ruleFromVal)(val, variableNames));
    const conflicts = Object.entries(seenVals)
        .filter(([, idxs]) => idxs.length > 1)
        .map(([val, idxes]) => ({
        condition: (0, rule_1.ruleFromVal)(parseInt(val), variableNames),
        rules: idxes.map(idx => dt[idx])
    }));
    return {
        uncoveredConditions: toRules,
        conflicts,
        incompleteRules: [],
        isSound: conflicts.length === 0 && toRules.length === 0,
    };
};
exports.evaluateTable = evaluateTable;
