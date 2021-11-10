"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine = exports.expand = exports.ruleFromVal = exports.numVal = void 0;
const helpers_1 = require("../helpers");
const value_1 = require("./value");
const numVal = (rule) => {
    let mask = 1;
    let num = 0;
    for (let i = 0; i < rule.length; i++) {
        const value = rule[rule.length - 1 - i];
        if (value === value_1.SimpleValue.T) {
            num |= mask;
        }
        mask <<= 1;
    }
    return num;
};
exports.numVal = numVal;
const ruleFromVal = (val, len) => {
    const masks = [...(0, helpers_1.range)(len)].map((_, i) => 1 << (len - i - 1));
    const flipped = masks.map(mask => (mask & val) === mask);
    const rule = flipped.map((f) => f ? value_1.SimpleValue.T : value_1.SimpleValue.F);
    return rule;
};
exports.ruleFromVal = ruleFromVal;
const expand = (rule) => {
    if (rule.length === 1) {
        const value = rule[0];
        return value === value_1.Value.ANY ?
            [
                [value_1.SimpleValue.T],
                [value_1.SimpleValue.F]
            ] : [rule];
    }
    const firstAnyIdx = rule.findIndex(value => value === value_1.Value.ANY);
    if (firstAnyIdx === -1) {
        return [rule];
    }
    const prefix = rule.slice(0, firstAnyIdx);
    const suffix = rule.slice(firstAnyIdx + 1, rule.length);
    const anyCondition = rule[firstAnyIdx];
    const conditionsfTrue = [...prefix, value_1.SimpleValue.T];
    const conditionsIfFalse = [...prefix, value_1.SimpleValue.F];
    const expandedSuffix = (0, exports.expand)(suffix);
    const trueCases = (0, helpers_1.oneToManyCartesianProduct)(conditionsfTrue, expandedSuffix);
    const falseCases = (0, helpers_1.oneToManyCartesianProduct)(conditionsIfFalse, expandedSuffix);
    return [
        ...trueCases,
        ...falseCases
    ];
};
exports.expand = expand;
const combine = (a, b) => {
    if (a.length !== b.length)
        throw new Error("Recieved incompatible rules");
    return a.map((aCond, i) => {
        const bCond = b[i];
        const match = aCond === bCond;
        if (!match)
            return value_1.Value.ANY;
        return aCond;
    });
};
exports.combine = combine;
