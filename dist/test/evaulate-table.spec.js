"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../src/helpers");
const evaluate_table_1 = require("../src/model/evaluate-table");
const rule_1 = require("../src/model/rule");
const value_1 = require("../src/model/value");
const { T, F, ANY } = value_1.Value;
const cases = [
    {
        rules: [
            [T, T],
            [T, F],
            [F, T],
        ],
        actions: [],
        ruleActions: [0, 1, 0],
        uncoveredVals: [0],
        overcoveredVals: [],
        isSound: false,
        redundantRules: [],
    },
    {
        rules: [
            [T, ANY],
            [F, T],
        ],
        actions: [],
        ruleActions: [],
        uncoveredVals: [0],
        overcoveredVals: [],
        isSound: false,
        redundantRules: [],
    },
    {
        rules: [
            [T, ANY],
            [F, ANY]
        ],
        actions: [],
        ruleActions: [],
        uncoveredVals: [],
        overcoveredVals: [],
        isSound: true,
        redundantRules: [],
    },
    {
        // Conflict and uncovered conditions
        rules: [
            [T, ANY],
            [T, T],
            [F, F]
        ],
        actions: [],
        ruleActions: [],
        uncoveredVals: [1],
        overcoveredVals: [3],
        isSound: false,
        redundantRules: [],
    }
];
describe("DecisionTable", () => {
    it("correctly identifies uncovered rules", () => {
        cases.forEach(tCase => {
            const rules = tCase.rules;
            const table = {
                rules,
                actions: tCase.actions,
                ruleActions: tCase.ruleActions,
                varNames: [...(0, helpers_1.range)(rules.length)].map(i => i.toString())
            };
            const { uncoveredConditions, conflicts, isSound, redundantRules } = (0, evaluate_table_1.evaluateTable)(table);
            const uncoveredVals = uncoveredConditions.map(uc => (0, rule_1.numVal)(uc));
            uncoveredVals.sort();
            expect(uncoveredVals).toEqual(tCase.uncoveredVals);
            const overcoveredVals = conflicts.map(({ condition }) => (0, rule_1.numVal)(condition));
            overcoveredVals.sort();
            expect(overcoveredVals).toEqual(tCase.overcoveredVals);
            // TODO: test redundant rule detection!
            expect(isSound).toEqual(tCase.isSound);
        });
    });
});
