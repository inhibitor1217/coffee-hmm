import { Connection } from 'typeorm';
export declare enum EventCategory {
    CAFE = "CAFE"
}
export declare enum EventName {
    VIEW = "VIEW"
}
export default class Event {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    userId: string | null;
    category: EventCategory;
    name: EventName;
    label: string | null;
    value: string | null;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): Event;
}
