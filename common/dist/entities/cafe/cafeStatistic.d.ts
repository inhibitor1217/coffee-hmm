import { Connection } from 'typeorm';
import Cafe from './cafe';
export default class CafeStatistic {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    fkCafeId: string;
    readonly cafe: Cafe;
    dailyViews: number;
    weeklyViews: number;
    monthlyViews: number;
    totalViews: number;
    numReviews: number;
    sumRatings: number;
    numLikes: number;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): CafeStatistic;
}
