import { DecisionTable, evaluateTable } from "../src/model/evaluate-table";
import { numVal } from "../src/model/rule";
import { Value } from "../src/model/value"

const { T, F, ANY } = Value;

interface Case {
    rules: Value[][];
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
            const table: DecisionTable = tCase.rules
                .map(
                    rule => rule.map(
                        (value, i) => ({
                            variableName: i.toString(),
                            value
                        })
                    )
                );

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
