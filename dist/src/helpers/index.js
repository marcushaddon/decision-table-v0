"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneToManyCartesianProduct = void 0;
const oneToManyCartesianProduct = (prefix, seqs) => seqs.map(seq => [...prefix, ...seq]);
exports.oneToManyCartesianProduct = oneToManyCartesianProduct;
