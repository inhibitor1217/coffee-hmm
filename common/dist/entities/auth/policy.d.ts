import { Connection } from 'typeorm';
import { IamPolicy } from '../../util/iam';
export default class Policy {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    name: string;
    value: string;
    get iamPolicy(): IamPolicy;
    toJsonObject(): AnyJson;
    static readonly columns: string[];
    static fromRawColumns(raw: Record<string, unknown>, options?: {
        alias?: string;
        connection?: Connection;
    }): Policy;
}
