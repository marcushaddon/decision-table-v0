import { SimpleRule } from "../src/model/rule";
import { Condition, SimpleCondition} from "../src/model/condition";

type TestCase = {
    conds: SimpleCondition[];
    num: number;
}

const { T, F } = SimpleCondition;

describe("Rule", () => {
    const names = ["A", "B", "C", "D"];

    it("converts to a number correctly", () => {
        const testCases: TestCase[] = [
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
            expect(new SimpleRule(names, testCase.conds).asNumber()).toEqual(testCase.num);
        })
    });
})
