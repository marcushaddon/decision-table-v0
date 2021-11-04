import { Condition, SimpleCondition } from "./condition";
export declare type SimpleRule = SimpleCondition[];
export declare type Rule = Condition[];
export declare const numVal: (rule: SimpleRule) => number;
export declare const ruleFromVal: (val: number, variableNames: string[]) => SimpleRule;
export declare const expand: (rule: Rule) => SimpleRule[];
//# sourceMappingURL=rule.d.ts.map