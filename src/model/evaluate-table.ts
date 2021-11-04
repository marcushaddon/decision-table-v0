import { expand, numVal, ruleFromVal, Rule, SimpleRule } from "./rule";
import Value from "./value";

export type DecisionTable = Rule[];

type UnmetCondition = SimpleRule; // I know, i know...
type ConflictingRules = {
    a: Rule;
    b: Rule;
    conflicts: Rule[];
};

type RedundantlyCoveredCondition = {
    condition: SimpleRule,
    rules: Rule[],
}

export type TableEvaluation = {
    uncoveredConditions: UnmetCondition[]; 
    conflicts: RedundantlyCoveredCondition[];
    incompleteRules: Rule[];
    isSound: boolean;
};

export const evaluateTable = (dt: DecisionTable): TableEvaluation => {
    if (dt.length === 0) {
        return {
            isSound: false,
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules: []
        }
    }
    const incompleteRules = dt.filter(
        rule => rule.findIndex(cond => cond.value === Value.UNKNOWN) > -1
    );

    if (incompleteRules.length > 0) {
        return {
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules,
            isSound: false,
        }
    }

    const allExpanded = dt.map(rule => expand(rule));
    // seenVals is a lookup from "rules numeric vallue"
    // to the idx of every rule in the table that covers it
    const seenVals = allExpanded.reduce((seen, expansion, idx) => {
        expansion.forEach(rule => {
            const val = numVal(rule);
            if (seen[val]) {
                seen[val].push(idx);
            } else {
                seen[val] = [idx];
            }
        });

        return seen;
    }, {} as { [val: number ]: number[] });

    const highestPossibleValue = Math.pow(2, dt[0].length);

    const allnums = [...Array(highestPossibleValue)]
        .map((_, i) => i);

    const notSeen = allnums
        .filter(val => !(val in seenVals));
    
    const variableNames = dt[0].map(cond => cond.variableName);
    const toRules = notSeen
        .map((val, ) => ruleFromVal(val, variableNames)) as UnmetCondition[];

    const conflicts = Object.entries(seenVals)
        .filter(([ ,idxs]) => idxs.length > 1)
        .map(([ val, idxes ]) => ({
            condition: ruleFromVal(parseInt(val), variableNames),
            rules: idxes.map(idx => dt[idx])
        }))

    return {
        uncoveredConditions: toRules,
        conflicts,
        incompleteRules: [],
        isSound: conflicts.length === 0 && toRules.length === 0,
    }
}