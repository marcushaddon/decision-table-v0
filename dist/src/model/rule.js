"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expand = exports.ruleFromVal = exports.numVal = void 0;
const helpers_1 = require("../helpers");
const value_1 = require("./value");
const numVal = (rule) => {
    let mask = 1;
    let num = 0;
    for (let i = 0; i < rule.length; i++) {
        const condition = rule[rule.length - 1 - i];
        if (condition.value === value_1.SimpleValue.T) {
            num |= mask;
        }
        mask <<= 1;
    }
    return num;
};
exports.numVal = numVal;
const ruleFromVal = (val, variableNames) => {
    const masks = variableNames.map((_, i) => 1 << (variableNames.length - i - 1));
    const flipped = masks.map(mask => (mask & val) === mask);
    const rule = variableNames.map((variableName, i) => ({
        variableName,
        value: flipped[i] ? value_1.SimpleValue.T : value_1.SimpleValue.F
    }));
    return rule;
};
exports.ruleFromVal = ruleFromVal;
const expand = (rule) => {
    if (rule.length === 1) {
        const { variableName, value } = rule[0];
        return value === value_1.Value.ANY ?
            [
                [{ variableName, value: value_1.SimpleValue.T }],
                [{ variableName, value: value_1.SimpleValue.F }]
            ] : [rule];
    }
    const firstAnyIdx = rule.findIndex(({ value }) => value === value_1.Value.ANY);
    if (firstAnyIdx === -1) {
        return [rule];
    }
    const prefix = rule.slice(0, firstAnyIdx);
    const suffix = rule.slice(firstAnyIdx + 1, rule.length);
    const anyCondition = rule[firstAnyIdx];
    const conditionsfTrue = [...prefix, Object.assign(Object.assign({}, anyCondition), { value: value_1.SimpleValue.T })];
    const conditionsIfFalse = [...prefix, Object.assign(Object.assign({}, anyCondition), { value: value_1.SimpleValue.F })];
    const expandedSuffix = (0, exports.expand)(suffix);
    const trueCases = (0, helpers_1.oneToManyCartesianProduct)(conditionsfTrue, expandedSuffix);
    const falseCases = (0, helpers_1.oneToManyCartesianProduct)(conditionsIfFalse, expandedSuffix);
    return [
        ...trueCases,
        ...falseCases
    ];
};
exports.expand = expand;
