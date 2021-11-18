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
        return this;
    }
    deleteRule(rule) {
        this.dt.deleteRule(rule);
        this.broadcast();
        return this;
    }
    renameVar(old, newName) {
        this.dt.renameVar(old, newName);
        this.broadcast();
        return this;
    }
    addVar(varName) {
        this.dt.addVar(varName);
        this.broadcast();
        return this;
    }
    renameAction(oldName, newName) {
        this.dt.renameAction(oldName, newName);
        this.broadcast();
        return this;
    }
    setCondition(row, varName, value) {
        this.dt.setCondition(row, varName, value);
        this.broadcast();
        return this;
    }
    addAction(name) {
        this.dt.addAction(name);
        this.broadcast();
        return this;
    }
    assignAction(rule, action) {
        this.dt.assignAction(rule, action);
        this.broadcast();
        return this;
    }
    simplifyRules(...rules) {
        this.dt.simplifyRules(...rules);
        this.broadcast();
        return this;
    }
    simplify() {
        this.dt.simplify();
        this.broadcast;
        return this;
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
    get state() {
        return this.dt.state;
    }
}
exports.PubSubTable = PubSubTable;
