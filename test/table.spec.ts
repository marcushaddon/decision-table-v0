import { Table } from "../src/model/table";
import { Value } from "../src/model/value";

const { T, F, ANY, UNKNOWN } = Value;

describe("Table", () => {
    const fieldNames = ["A", "B"];
    const table = new Table(fieldNames);

    it("happy paths", () => {
        // Handles empty table
        expect(table.evaluate().isSound).toBeFalsy();

        // Can add rules out of order
        table.addRule([
            { varName: "B", value: UNKNOWN },
            { varName: "A", value: T },
        ]);

        expect(table.evaluate().isSound).toBeFalsy();
        expect(table.evaluate().incompleteRules.length).toEqual(1);

        // Sets condition
        table.setCondition(0, "B", ANY);
        const res1 = table.evaluate();
        expect(res1.isSound).toBeFalsy();
        expect(res1.uncoveredConditions.length).toEqual(2);

        // Updates evaluation
        table.addRule([
            { varName: "A", value: F },
            { varName: "B", value: T },
        ]);

        const res2 = table.evaluate();
        expect(res2.isSound).toBeFalsy();
        expect(res2.uncoveredConditions.length).toEqual(1);

        // Becomes valid after updating condition
        table.setCondition(1, "B", ANY);

        const res3 = table.evaluate();
        expect(res3.isSound).toBeTruthy();
        expect(res3.uncoveredConditions.length).toEqual(0);

        // Detects overlapping rules
        table.addRule([
            {
                varName: "A",
                value: F
            },
            {
                varName: "B",
                value: T
            }
        ]);

        const res4 = table.evaluate();
        expect(res4.isSound).toBeFalsy();
        expect(res4.incompleteRules.length).toEqual(0);
        expect(res4.uncoveredConditions.length).toEqual(0);
        expect(res4.conflicts.length).toEqual(1);

        table.addVar("C");
        const res5 = table.evaluate();
        expect(res5.isSound).toBeFalsy();
        expect(res5.incompleteRules.length).toEqual(3);
    });

    it("sad paths", () => {
        const t2 = new Table(fieldNames);

        // Detects missing fields
        expect(() => {
            t2.addRule([
                {
                    varName: "A",
                    value: T,
                }
            ])
        }).toThrow();

        // Detects unknown fields
        expect(() => {
            t2.addRule([
                {
                    varName: "A",
                    value: T,
                },
                {
                    varName: "B",
                    value: ANY
                },
                {
                    varName: "C",
                    value: T,
                }
            ])
        }).toThrow();

        // Protects existing variables
        expect(() => {
            t2.renameVar("A", "B")
        }).toThrow();

        // Cant rename nonexistent var
        expect(() => {
            t2.renameVar("C", "D");
        }).toThrow();
    })
});
