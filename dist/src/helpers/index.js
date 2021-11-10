"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleGraph = exports.overlap = exports.range = exports.fliterate = exports.oneToManyCartesianProduct = void 0;
const __1 = require("..");
const { ANY, UNKNOWN } = __1.Value;
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
