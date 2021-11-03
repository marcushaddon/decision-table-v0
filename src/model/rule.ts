import { Condition, SimpleCondition } from "./condition";

export class SimpleRule {
    constructor(
        private conditionNames: string[],
        private conditions: SimpleCondition[],
    ) {} // TODO: validate

    // TODO: cache this
    public asNumber(): number {
        let mask = 1;
        let num = 0;
        let i = 0;
        for (let i = 0; i < this.conditions.length; i++) {
            const condition = this.conditions[this.conditions.length - 1 - i];
            if (condition === SimpleCondition.T) {
                num |= mask;
            }
            mask <<= 1;
        }

        return num;
    }

    public eq(other: SimpleRule): boolean {
        return this.asNumber() === other.asNumber();
    }
};

export class Rule {
    constructor(
        private conditionNames: string[],
        private conditions: Condition[],
    ) {} // TODO: validate

    // public expand(): SimpleRule[] {

    // }
}