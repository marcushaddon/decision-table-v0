"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleValue = exports.Value = void 0;
var Value;
(function (Value) {
    Value["T"] = "T";
    Value["F"] = "F";
    Value["ANY"] = "-";
    Value["UNKNOWN"] = "?";
})(Value = exports.Value || (exports.Value = {}));
var SimpleValue;
(function (SimpleValue) {
    SimpleValue["T"] = "T";
    SimpleValue["F"] = "F";
})(SimpleValue = exports.SimpleValue || (exports.SimpleValue = {}));
exports.default = Value;
