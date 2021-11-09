"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSub = void 0;
class PubSub {
    constructor() {
        /**
         * Init subId counter
         * create Map<EventNames, Map<subId, (data: EventData) => void>>
         * create Map<subId, eventName>
         * register callbacks returning incrementing id
         * deregister callbacks by id using second map
         * invoke all callbacks for event at appropriate times
         */
        this.subs = new Map();
        this.subIndex = new Map();
        this.id = 0;
    }
    on(eventName, cb) {
        if (!this.subs.has(eventName)) {
            this.subs.set(eventName, new Map());
        }
        this.subs.get(eventName).set(this.id, cb);
        this.subIndex.set(this.id, eventName);
        const old = this.id;
        this.id++;
        return old;
    }
    cancel(subId) {
        var _a;
        const eventName = this.subIndex.get(subId);
        if (!eventName)
            return;
        (_a = this.subs.get(eventName)) === null || _a === void 0 ? void 0 : _a.delete(subId);
    }
    emit(eventName, data) {
        const subs = this.subs.get(eventName);
        if (!subs)
            return;
        subs.forEach(cb => cb(data));
    }
}
exports.PubSub = PubSub;
