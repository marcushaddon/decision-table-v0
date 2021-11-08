"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const value_1 = require("../src/model/value");
const rule_1 = require("../src/model/rule");
const { T, F, ANY } = value_1.Value;
const BIG_NUM = 20;
// const { T, F, ANY } = Condition;
describe("Rule", () => {
    const cases = [
        {
            values: [F, F, T, T],
            expanded: [3]
        },
        {
            values: [F],
            expanded: [0]
        },
        {
            values: [T],
            expanded: [1]
        },
        {
            values: [ANY],
            expanded: [0, 1]
        },
        {
            values: [ANY, F, ANY],
            expanded: [0, 1, 4, 5]
        },
        {
            values: [F, F, F, ANY],
            expanded: [0, 1]
        },
        {
            values: [...Array(BIG_NUM)].map(() => ANY),
            expanded: [...Array(Math.pow(2, BIG_NUM))].map((_, i) => i).sort()
        },
    ];
    it("expands rules containing 'any' conditions into all possible explicit rules", () => {
        cases.forEach(tCase => {
            const rule = tCase.values;
            const start = new Date().getTime();
            const res = (0, rule_1.expand)(rule)
                .map(expanded => (0, rule_1.numVal)(expanded));
            const dur = new Date().getTime() - start;
            console.log(`Calculated ${res.length} possible rules in ${dur} ms`);
            res.sort();
            expect(res).toEqual(tCase.expanded);
        });
    });
});
