"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubTable = void 0;
const pub_sub_1 = require("./pub-sub");
const table_1 = require("./table");
class PubSubTable {
    /**
     * init table
     * init pub sub of appropriate types
     * forward table/pub sub methods
     */
    constructor(dt = new table_1.Table(), ps = new pub_sub_1.PubSub()) {
        this.dt = dt;
        this.ps = ps;
    }
    broadcast() {
        const evaluation = this.dt.evaluate();
        this.ps.emit("evaluated", evaluation);
    }
    /**
     * Forward Table methods, TODO: evaulate and maybe broadcast
     */
    addRule(rule) {
        this.dt.addRule(rule);
        this.broadcast();
    }
    renameVar(old, newName) {
        this.dt.renameVar(old, newName);
        this.broadcast();
    }
    addVar(varName) {
        this.dt.addVar(varName);
        this.broadcast();
    }
    setCondition(row, varName, value) {
        this.dt.setCondition(row, varName, value);
        this.broadcast();
    }
    /**
     * Forward pubsub methods
     */
    onEvaluated(cb) {
        return this.ps.on("evaluated", cb);
    }
    cancel(id) {
        return this.ps.cancel(id);
    }
}
exports.PubSubTable = PubSubTable;
