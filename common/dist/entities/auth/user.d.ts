import { Connection } from 'typeorm';
import Policy from './policy';
import UserProfile from './userProfile';
export declare enum UserState {
    active = 0,
    deleted = 1
}
export declare type UserStateStrings = keyof typeof UserState;
export declare enum AuthProvider {
    google = 0,
    custom = 10
}
export declare type AuthProviderStrings = keyof typeof AuthProvider;
export default class User {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    lastSignedAt: Date | null;
    fkUserProfileId: string;
    readonly profile: UserProfile;
    fkPolicyId: string;
    readonly policy: Policy;
    state: UserState;
    get stateString(): UserStateStrings;
    provider: AuthProvider;
    get providerString(): AuthProviderStrings;
    providerUserId: string;
    providerUserEmail: string | null;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): User;
}
