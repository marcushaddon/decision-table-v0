import { oneToManyCartesianProduct } from "../helpers";
import { Condition, SimpleCondition } from "./condition";
import { Value, SimpleValue } from "./value";

export type SimpleRule = SimpleCondition[];
export type Rule = Condition[];

export const numVal = (rule: SimpleRule): number => {
    let mask = 1;
    let num = 0;
    let i = 0;
    for (let i = 0; i < rule.length; i++) {
        const condition = rule[rule.length - 1 - i];
        if (condition.value === SimpleValue.T) {
            num |= mask;
        }
        mask <<= 1;
    }

    return num;
}

export const expand = (rule: Rule): SimpleRule[] => {
    if (rule.length === 1) {
        const { variableName, value } = rule[0];
        return value === Value.ANY ?
            [ 
                [{ variableName, value: SimpleValue.T }],
                [{ variableName, value: SimpleValue.F }]
            ] : [ rule as unknown as SimpleRule ]
    }

    const firstAnyIdx = rule.findIndex(({ value }) => value === Value.ANY);
    if (firstAnyIdx === -1) {
        return [ rule as unknown as SimpleRule ];
    }

    const prefix = rule.slice(0, firstAnyIdx) as unknown as SimpleCondition[];
    const suffix = rule.slice(firstAnyIdx+1, rule.length);
    const anyCondition = rule[firstAnyIdx];

    const conditionsfTrue: SimpleRule = 
        [ ...prefix, { ...anyCondition, value: SimpleValue.T }];
    const conditionsIfFalse: SimpleRule = 
        [ ...prefix, { ...anyCondition, value: SimpleValue.F }];
    
    const expandedSuffix = expand(suffix);
    
    const trueCases = oneToManyCartesianProduct(conditionsfTrue, expandedSuffix);
    const falseCases = oneToManyCartesianProduct(conditionsIfFalse, expandedSuffix);

    return [
        ...trueCases,
        ...falseCases
    ];
}
