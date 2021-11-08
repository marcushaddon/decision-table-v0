"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = exports.fliterate = exports.oneToManyCartesianProduct = void 0;
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
