import { Connection } from 'typeorm';
import Place from './place';
import CafeStatistic from './cafeStatistic';
import CafeImage from './cafeImage';
import CafeImageCount from './cafeImageCount';
export declare enum CafeState {
    active = 0,
    hidden = 1,
    deleted = 2
}
export declare type CafeStateStrings = keyof typeof CafeState;
export default class Cafe {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    name: string;
    fkPlaceId: string;
    place: Place;
    metadata: string | null;
    get metadataObject(): AnyJson;
    set metadataObject(obj: AnyJson);
    state: CafeState;
    get stateString(): CafeStateStrings;
    isDeleted(): boolean;
    statistic: CafeStatistic;
    imageCount: CafeImageCount;
    images: CafeImage[];
    toJsonObject(options?: {
        showHiddenImages?: boolean;
    }): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): Cafe;
}
