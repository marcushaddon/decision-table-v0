export declare class PubSub<EventNames = string, EventData = any> {
    /**
     * Init subId counter
     * create Map<EventNames, Map<subId, (data: EventData) => void>>
     * create Map<subId, eventName>
     * register callbacks returning incrementing id
     * deregister callbacks by id using second map
     * invoke all callbacks for event at appropriate times
     */
    private subs;
    private subIndex;
    private id;
    on(eventName: EventNames, cb: (data: EventData) => void): number;
    cancel(subId: number): void;
    emit(eventName: EventNames, data: EventData): void;
}
//# sourceMappingURL=pub-sub.d.ts.map