import { Connection } from 'typeorm';
import Cafe from './cafe';
export declare enum CafeImageState {
    active = 0,
    hidden = 1,
    deleted = 2
}
export declare type CafeImageStateStrings = keyof typeof CafeImageState;
export default class CafeImage {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    fkCafeId: string;
    readonly cafe: Cafe;
    index: number;
    isMain: boolean;
    metadata: string | null;
    get metadataObject(): AnyJson;
    set metadataObject(obj: AnyJson);
    relativeUri: string;
    state: CafeImageState;
    get stateString(): CafeImageStateStrings;
    isDeleted(): boolean;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): CafeImage;
}
