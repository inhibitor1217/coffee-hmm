import { Connection } from 'typeorm';
import Cafe from './cafe';
export default class UserCafeLike {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    fkCafeId: string;
    readonly cafe: Cafe;
    userId: string;
    like: boolean;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): UserCafeLike;
}
