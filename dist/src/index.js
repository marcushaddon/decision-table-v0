"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleValue = exports.Value = void 0;
const table_1 = require("./model/table");
const value_1 = require("./model/value");
Object.defineProperty(exports, "Value", { enumerable: true, get: function () { return value_1.Value; } });
Object.defineProperty(exports, "SimpleValue", { enumerable: true, get: function () { return value_1.SimpleValue; } });
exports.default = table_1.Table;
