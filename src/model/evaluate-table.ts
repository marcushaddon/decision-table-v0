import { expand, numVal, ruleFromVal, Rule, SimpleRule } from "./rule";
import Value from "./value";
import { range } from "../helpers";

export type DecisionTable = {
    rules: Rule[];
    varNames: string[];
    actions: string[];
    ruleActions: number[];
};

type UnmetCondition = SimpleRule; // I know, i know...

type RedundantlyCoveredCondition = {
    condition: SimpleRule,
    rules: Rule[],
    ruleIdxs: number[],
}

type RedundantlyCoveredAction = {
    action: number,
    rules: Rule[],
    ruleIdxs: number[],
}

export type TableEvaluation = {
    uncoveredConditions: UnmetCondition[]; 
    conflicts: RedundantlyCoveredCondition[];
    redundantRules: RedundantlyCoveredAction[];
    incompleteRules: Rule[];
    isSound: boolean;
};

export const evaluateTable = ({ rules, actions, ruleActions }: DecisionTable): TableEvaluation => {
    if (rules.length === 0) {
        return {
            isSound: false,
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules: [],
            redundantRules: [],
        }
    }
    const incompleteRules = rules.filter(
        rule => rule.findIndex(v => v === Value.UNKNOWN) > -1
    );

    // TODO: maybe still figure out the others as mucha s possible?
    if (incompleteRules.length > 0) {
        return {
            uncoveredConditions: [],
            conflicts: [],
            incompleteRules,
            isSound: false,
            redundantRules: [],
        }
    }

    // TODO: note redundant actions
    const redundantRules: RedundantlyCoveredAction[] = [];
    for (let i = 0; i < rules.length; i++) {
        for (let j = i; j < rules.length; j++) {
            if (ruleActions[i] === ruleActions[j]) {
                redundantRules.push({
                    action: ruleActions[i],
                    rules: [rules[i], rules[j]],
                    ruleIdxs: [i, j]
                });
            }
        }
    }

    const allExpanded = rules.map(rule => expand(rule));
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
    }, {} as { [ val: number ]: number[] });

    const highestPossibleValue = Math.pow(2, rules[0].length);

    const allnums = [...range(highestPossibleValue)];

    const notSeen = allnums
        .filter(val => !(val in seenVals));

    const len = rules[0].length;
    
    const toRules = notSeen
        .map((val, ) => ruleFromVal(val, len)) as UnmetCondition[];

    const conflicts = Object.entries(seenVals)
        .filter(([ ,idxs]) => idxs.length > 1)
        .map(([ val, ruleIdxs ]) => ({
            condition: ruleFromVal(parseInt(val), len),
            rules: ruleIdxs.map(idx => rules[idx]),
            ruleIdxs
        }));

    return {
        uncoveredConditions: toRules,
        conflicts,
        incompleteRules: [],
        isSound: conflicts.length === 0 && toRules.length === 0,
        redundantRules,
    };
};


// getAllCombinations
// getSeenCombinations
