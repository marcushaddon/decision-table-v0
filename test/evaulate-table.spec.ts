import { DecisionTable, evaluateTable } from "../src/model/evaluate-table";
import { numVal, Rule } from "../src/model/rule";
import { Value } from "../src/model/value"

const { T, F, ANY } = Value;

interface Case {
    rules: Value[][];
    actions: string[];
    ruleActions: number[];
    uncoveredVals: number[];
    overcoveredVals: number[];
    isSound: boolean;
}

const cases: Case[] = [
    {
        rules: [
            [T, T],
            [T, F],
            [F, T],
        ],
        actions: [],
        ruleActions: [],
        uncoveredVals: [0],
        overcoveredVals: [],
        isSound: false,
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
        isSound: true
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
    }
];

describe("DecisionTable", () => {
    it("correctly identifies uncovered rules", () => {
        cases.forEach(tCase => {
            const rules: Rule[]= tCase.rules
                .map(
                    rule => rule.map(
                        (value, i) => ({
                            variableName: i.toString(),
                            value
                        })
                    )
                );
            
            const table: DecisionTable = {
                rules,
                actions: tCase.actions,
                ruleActions: tCase.ruleActions
            }

            const { uncoveredConditions, conflicts, isSound } = evaluateTable(table);

            const uncoveredVals = uncoveredConditions.map(uc => numVal(uc));
            uncoveredVals.sort();
            expect(uncoveredVals).toEqual(tCase.uncoveredVals);

            const overcoveredVals = conflicts.map(({ condition }) => numVal(condition));
            overcoveredVals.sort();
            expect(overcoveredVals).toEqual(tCase.overcoveredVals);

            expect(isSound).toEqual(tCase.isSound);
        });
    })
});
