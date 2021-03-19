import { Connection } from 'typeorm';
export default class Place {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    name: string;
    pinned: boolean;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): Place;
}
