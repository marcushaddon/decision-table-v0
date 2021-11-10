import { expand, numVal, ruleFromVal, Rule, SimpleRule } from "./rule";
import Value from "./value";
import { range, RuleGraph, overlap } from "../helpers";

export type DecisionTable = {
    rules: Rule[];
    varNames: string[];
    actions: string[];
    ruleActions: string[]; // Memberwise with rules
};

type UnmetCondition = SimpleRule; // I know, i know...

type RedundantlyCoveredCondition = {
    condition: SimpleRule,
    rules: Rule[],
    ruleIdxs: number[],
}

type RedundantlyCoveredAction = {
    action: string,
    rules: Rule[],
    ruleIdxs: number[],
}

export type TableEvaluation = {
    uncoveredConditions: UnmetCondition[]; 
    conflicts: number[][];
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

    const rulesWithIdxs: [Rule, number][] = rules
            .map((rule, idx) => [rule, idx]);

    const redundantRules: RedundantlyCoveredAction[] = [];
    for (const action of actions) {
        const multiple = ruleActions.filter(ra => ra === action).length > 1;
        if (!multiple) continue

        
        const offenders = rulesWithIdxs
            .filter(([rule, idx]) => ruleActions[idx] === action);

        redundantRules.push({
            action: action,
            rules: offenders.map(([rule, ]) => rule),
            ruleIdxs: offenders.map(([, idx]) => idx)
        });
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

    // TODO: dont mark rules without actions or with same actions as conflicts
    const conflictGraph = new RuleGraph();
    for (let i = 0; i < rules.length; i++) {
        for (let j = i+1; j < rules.length; j++) {
            const a = rules[i];
            const b = rules[j];
            const sameActions = ruleActions[i] === ruleActions[j];
            if (!sameActions) continue;
            if (overlap(a, b)) {
                conflictGraph.addEdge(i, j);
            }
        }
    }
    const conflicts = conflictGraph.edges();

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
