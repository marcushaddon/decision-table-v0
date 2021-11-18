"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equal = exports.RuleGraph = exports.combine = exports.canBeCombined = exports.overlap = exports.range = exports.fliterate = exports.oneToManyCartesianProduct = void 0;
const value_1 = require("../model/value");
const { ANY, UNKNOWN } = value_1.Value;
const oneToManyCartesianProduct = (prefix, seqs) => seqs.map(seq => [...prefix, ...seq]);
exports.oneToManyCartesianProduct = oneToManyCartesianProduct;
function* fliterate(nested) {
    for (let i = 0; i < nested.length; i++) {
        for (const item of nested[i]) {
            yield [i, item];
        }
    }
}
exports.fliterate = fliterate;
function* range(n, m) {
    let i = (typeof m === 'number') ? n : 0;
    const end = (typeof m === 'number') ? m : n;
    while (i < end) {
        yield i;
        i++;
    }
}
exports.range = range;
const overlap = (a, b) => {
    if (a.length != b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] === ANY ||
            b[i] === ANY ||
            a[i] === b[i])
            continue;
        return false;
    }
    return true;
};
exports.overlap = overlap;
// This makes a strong assumption taht both rules have the same action!
const canBeCombined = (a, b) => {
    if (a.length !== b.length) {
        throw new Error("Mis matched rule lengths!");
    }
    let conflicts = 0;
    for (let i = 0; i < a.length; i++) {
        const ar = a[i];
        const br = b[i];
        if (ar !== ANY && br !== ANY && ar !== br) {
            conflicts++;
        }
        if (conflicts > 1) {
            return false;
        }
    }
    return true;
};
exports.canBeCombined = canBeCombined;
// NOTE: Does not check to see if they *can* be combined
const _combine = (a, b) => {
    if (a.length !== b.length)
        throw new Error("Rule length mis match!");
    return a.map((aCond, idx) => {
        const bCond = b[idx];
        if (aCond === bCond)
            return aCond;
        return ANY;
    });
};
const combine = (...rules) => {
    if (rules.length < 2)
        return rules[0];
    return rules.slice(1)
        .reduce((rule, current) => _combine(rule, current), rules[0]);
};
exports.combine = combine;
class RuleGraph {
    constructor() {
        this.graph = {};
    }
    addEdge(fromIdx, toIdx) {
        if (!(fromIdx in this.graph)) {
            this.graph[fromIdx] = { [toIdx]: true };
        }
        else if (!this.graph[fromIdx][toIdx]) {
            this.graph[fromIdx][toIdx] = true;
        }
    }
    haveEdge(fromIdx, toIdx) {
        var _a, _b;
        return ((_a = this.graph[fromIdx]) === null || _a === void 0 ? void 0 : _a[toIdx]) ||
            ((_b = this.graph[toIdx]) === null || _b === void 0 ? void 0 : _b[fromIdx]);
    }
    edges() {
        return Object.entries(this.graph)
            .reduce((acc, [node, edges]) => {
            const expanded = Object.keys(edges).map(edge => [parseInt(node), parseInt(edge)]);
            return [
                ...acc,
                ...expanded
            ];
        }, []);
    }
    has(n) {
        return n in this.graph;
    }
}
exports.RuleGraph = RuleGraph;
const equal = (a, b) => a.length === b.length && a.findIndex((c, i) => c !== b[i]) < 0;
exports.equal = equal;
