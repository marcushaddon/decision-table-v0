import { SimpleRule, numVal } from "../src/model/rule";
import { SimpleValue } from "../src/model/value";

type NumberTestCase = {
    conds: SimpleValue[];
    num: number;
}

const { T, F } = SimpleValue;

describe("SimpleRule", () => {
    const names = ["A", "B", "C", "D"];

    it("converts to a number correctly", () => {
        const testCases: NumberTestCase[] = [
            {
                conds: [F, F, F, F],
                num: 0
            },
            {
                conds: [F, F, F, T],
                num: 1
            },
            {
                conds: [F, F, T, T],
                num: 3
            },
            {
                conds: [F, F, T, F],
                num: 2
            },
            {
                conds: [T, F, F, T],
                num: 9
            },
            {
                conds: [F, T, T, F],
                num: 6
            },
        ];
        
        testCases.forEach(testCase => {
            const rule: SimpleRule = testCase.conds;
            expect(
                numVal(rule)
            ).toEqual(testCase.num);
        })
    });
});
