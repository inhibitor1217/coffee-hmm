import { Connection } from 'typeorm';
export default class UserProfile {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    name: string;
    email: string | null;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): UserProfile;
}
