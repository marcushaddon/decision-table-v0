import { Value, SimpleValue } from "./value";
export declare type SimpleRule = SimpleValue[];
export declare type Rule = Value[];
export declare const numVal: (rule: SimpleRule) => number;
export declare const ruleFromVal: (val: number, len: number) => SimpleRule;
export declare const expand: (rule: Rule) => SimpleRule[];
export declare const combine: (a: SimpleRule, b: SimpleRule) => Rule;
//# sourceMappingURL=rule.d.ts.map