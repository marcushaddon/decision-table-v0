import { resourceUsage } from "process";
import { range } from "../src/helpers";
import { DecisionTable, evaluateTable } from "../src/model/evaluate-table";
import { numVal, Rule } from "../src/model/rule";
import { Value } from "../src/model/value"

const { T, F, ANY } = Value;

interface Case {
    rules: Value[][];
    actions: string[];
    ruleActions: number[];
    uncoveredVals: number[];
    // This is poorly named, this represents conflicts
    overcoveredVals: number[];
    isSound: boolean;
    redundantRules: number[],
}

const cases: Case[] = [
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
            const rules: Rule[]= tCase.rules;
            
            const table: DecisionTable = {
                rules,
                actions: tCase.actions,
                ruleActions: tCase.ruleActions,
                varNames: [...range(rules.length)].map(i => i.toString())
            }

            const { uncoveredConditions, conflicts, isSound, redundantRules } = evaluateTable(table);

            const uncoveredVals = uncoveredConditions.map(uc => numVal(uc));
            uncoveredVals.sort();
            expect(uncoveredVals).toEqual(tCase.uncoveredVals);

            const overcoveredVals = conflicts.map(({ condition }) => numVal(condition));
            overcoveredVals.sort();
            expect(overcoveredVals).toEqual(tCase.overcoveredVals);
            
            // TODO: test redundant rule detection!

            expect(isSound).toEqual(tCase.isSound);
        });
    })
});
