"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule_1 = require("../src/model/rule");
const value_1 = require("../src/model/value");
const { T, F } = value_1.SimpleValue;
describe("SimpleRule", () => {
    const names = ["A", "B", "C", "D"];
    it("converts to a number correctly", () => {
        const testCases = [
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
            const rule = testCase.conds;
            expect((0, rule_1.numVal)(rule)).toEqual(testCase.num);
        });
    });
});
