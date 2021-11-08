export class PubSub<EventNames = string, EventData = any> {
    /**
     * Init subId counter
     * create Map<EventNames, Map<subId, (data: EventData) => void>>
     * create Map<subId, eventName>
     * register callbacks returning incrementing id
     * deregister callbacks by id using second map
     * invoke all callbacks for event at appropriate times
     */
    private subs: Map<EventNames, Map<number, (data: EventData) => void>> = new Map();
    private subIndex: Map<number, EventNames> = new Map();
    private id = 0;

    public on(eventName: EventNames, cb: (data: EventData) => void) {
        if (!this.subs.has(eventName)) {
            this.subs.set(eventName, new Map<number, (d: EventData) => void>());
        }

        this.subs.get(eventName)!.set(this.id, cb);
        this.subIndex.set(this.id, eventName);

        const old = this.id;
        this.id++;

        return old;
    }

    public cancel(subId: number) {
        const eventName = this.subIndex.get(subId);
        console.log("EVENT NAME FOR", subId, eventName, this.subIndex);
        if (!eventName) return;
        this.subs.get(eventName)?.delete(subId);
    }

    public emit(eventName: EventNames, data: EventData) {
        const subs = this.subs.get(eventName);
        if (!subs) return;

        subs.forEach(cb => cb(data));
    }
}