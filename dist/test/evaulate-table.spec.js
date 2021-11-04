"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        uncoveredVals: [0],
        overcoveredVals: [],
        isSound: false,
    },
    {
        rules: [
            [T, ANY],
            [F, T],
        ],
        uncoveredVals: [0],
        overcoveredVals: [],
        isSound: false,
    },
    {
        rules: [
            [T, ANY],
            [F, ANY]
        ],
        uncoveredVals: [],
        overcoveredVals: [],
        isSound: true
    },
    {
        // Conflict and uncovered conditions
        rules: [
            [T, ANY],
            [T, T],
            [F, F]
        ],
        uncoveredVals: [1],
        overcoveredVals: [3],
        isSound: false,
    }
];
describe("DecisionTable", () => {
    it("correctly identifies uncovered rules", () => {
        cases.forEach(tCase => {
            const table = tCase.rules
                .map(rule => rule.map((value, i) => ({
                variableName: i.toString(),
                value
            })));
            const { uncoveredConditions, conflicts, isSound } = (0, evaluate_table_1.evaluateTable)(table);
            const uncoveredVals = uncoveredConditions.map(uc => (0, rule_1.numVal)(uc));
            uncoveredVals.sort();
            expect(uncoveredVals).toEqual(tCase.uncoveredVals);
            const overcoveredVals = conflicts.map(({ condition }) => (0, rule_1.numVal)(condition));
            overcoveredVals.sort();
            expect(overcoveredVals).toEqual(tCase.overcoveredVals);
            expect(isSound).toEqual(tCase.isSound);
        });
    });
});
