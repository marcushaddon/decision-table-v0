import { oneToManyCartesianProduct, range } from "../helpers";
import { Condition, SimpleCondition } from "./condition";
import { Value, SimpleValue } from "./value";

export type SimpleRule = SimpleValue[];
export type Rule = Value[];

export const numVal = (rule: SimpleRule): number => {
    let mask = 1;
    let num = 0;
    for (let i = 0; i < rule.length; i++) {
        const value = rule[rule.length - 1 - i];
        if (value === SimpleValue.T) {
            num |= mask;
        }
        mask <<= 1;
    }

    return num;
};

export const ruleFromVal = (val: number, len: number): SimpleRule => {
    const masks = [ ...range(len)].map((_, i) => 1 << (len - i - 1));
    const flipped = masks.map(mask => (mask & val) === mask);
    const rule: SimpleRule = flipped.map((f) => f ? SimpleValue.T : SimpleValue.F)

    return rule;
}

export const expand = (rule: Rule): SimpleRule[] => {
    if (rule.length === 1) {
        const value = rule[0];
        return value === Value.ANY ?
            [ 
                [ SimpleValue.T ],
                [ SimpleValue.F ]
            ] : [ rule as unknown as SimpleRule ]
    }

    const firstAnyIdx = rule.findIndex(value => value === Value.ANY);
    if (firstAnyIdx === -1) {
        return [ rule as unknown as SimpleRule ];
    }

    const prefix = rule.slice(0, firstAnyIdx) as unknown as SimpleValue[];
    const suffix = rule.slice(firstAnyIdx+1, rule.length);
    const anyCondition = rule[firstAnyIdx];

    const conditionsfTrue: SimpleRule = 
        [ ...prefix, SimpleValue.T ];
    const conditionsIfFalse: SimpleRule = 
        [ ...prefix, SimpleValue.F ];
    
    const expandedSuffix = expand(suffix);
    
    const trueCases = oneToManyCartesianProduct(conditionsfTrue, expandedSuffix);
    const falseCases = oneToManyCartesianProduct(conditionsIfFalse, expandedSuffix);

    return [
        ...trueCases,
        ...falseCases
    ];
};
