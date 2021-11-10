"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTable = void 0;
const rule_1 = require("./rule");
const value_1 = __importDefault(require("./value"));
const helpers_1 = require("../helpers");
const evaluateTable = ({ rules, actions, ruleActions }) => {
    if (rules.length === 0) {
        return {
            isSound: false,
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules: [],
            redundantRules: [],
        };
    }
    const incompleteRules = rules.filter(rule => rule.findIndex(v => v === value_1.default.UNKNOWN) > -1);
    // TODO: maybe still figure out the others as mucha s possible?
    if (incompleteRules.length > 0) {
        return {
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules,
            isSound: false,
            redundantRules: [],
        };
    }
    const rulesWithIdxs = rules
        .map((rule, idx) => [rule, idx]);
    const redundantRules = [];
    for (const action of actions) {
        const multiple = ruleActions.filter(ra => ra === action).length > 1;
        if (!multiple)
            continue;
        const offenders = rulesWithIdxs
            .filter(([rule, idx]) => ruleActions[idx] === action);
        redundantRules.push({
            action: action,
            rules: offenders.map(([rule,]) => rule),
            ruleIdxs: offenders.map(([, idx]) => idx)
        });
    }
    const allExpanded = rules.map(rule => (0, rule_1.expand)(rule));
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
    const highestPossibleValue = Math.pow(2, rules[0].length);
    const allnums = [...(0, helpers_1.range)(highestPossibleValue)];
    const notSeen = allnums
        .filter(val => !(val in seenVals));
    const len = rules[0].length;
    const toRules = notSeen
        .map((val) => (0, rule_1.ruleFromVal)(val, len));
    const conflicts = Object.entries(seenVals)
        .filter(([, idxs]) => idxs.length > 1)
        .map(([val, ruleIdxs]) => ({
        condition: (0, rule_1.ruleFromVal)(parseInt(val), len),
        rules: ruleIdxs.map(idx => rules[idx]),
        ruleIdxs
    }));
    return {
        uncoveredConditions: toRules,
        conflicts,
        incompleteRules: [],
        isSound: conflicts.length === 0 && toRules.length === 0,
        redundantRules,
    };
};
exports.evaluateTable = evaluateTable;
// getAllCombinations
// getSeenCombinations
