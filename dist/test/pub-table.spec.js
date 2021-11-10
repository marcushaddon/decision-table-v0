"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pub_table_1 = require("../src/model/pub-table");
const value_1 = require("../src/model/value");
const getMock = () => {
    return {
        result: {
            conflicts: [],
            uncoveredConditions: [],
            redundantRules: [],
            incompleteRules: [],
            isSound: true,
        },
        state: {
            rules: [],
            ruleActions: [],
            varNames: [],
            actions: [],
        },
        addAction() { return; },
        assignAction() { return; },
        addRule() { return; },
        addVar() { return; },
        setCondition() { return; },
        renameVar() { return; },
        evaluate() { return this.result; }
    };
};
describe("PubSubTable", () => {
    it("invokes callbacks", () => {
        const mockDt = getMock();
        const uut = new pub_table_1.PubSubTable(mockDt);
        const cb = jest.fn();
        const sub = uut.onEvaluated(cb);
        uut.addRule([]);
        expect(cb).toHaveBeenCalledTimes(1);
        uut.addVar("foo");
        expect(cb).toHaveBeenCalledTimes(2);
        uut.setCondition(1, "foo", value_1.Value.T);
        expect(cb).toHaveBeenCalledTimes(3);
        uut.cancel(sub);
        uut.setCondition(1, "foo", value_1.Value.F);
        expect(cb).toHaveBeenCalledTimes(3);
    });
});
