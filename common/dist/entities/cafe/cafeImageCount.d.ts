import { Connection } from 'typeorm';
import Cafe from './cafe';
export default class CafeImageCount {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    fkCafeId: string;
    readonly cafe: Cafe;
    total: number;
    active: number;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): CafeImageCount;
}
