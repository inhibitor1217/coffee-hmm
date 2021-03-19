import { IamRule, IamRuleObject, OperationSchema } from '.';
import { PolicyExecutionContext } from './interface';
declare type IamPolicyParams = {
    rules: IamRule[];
};
export declare type IamPolicyObject = {
    rules: IamRuleObject[];
};
export default class IamPolicy {
    rules: IamRule[];
    constructor(params: IamPolicyParams);
    toJsonObject(): IamPolicyObject;
    canExecuteOperation(state: PolicyExecutionContext, schema: OperationSchema): boolean;
    canExecuteOperations(state: PolicyExecutionContext, schemas: OperationSchema[]): boolean;
    static isValidPolicyJsonObject(json: AnyJson): json is IamPolicyObject;
    static fromJsonObject(json: IamPolicyObject): IamPolicy;
    static parse(raw: string): IamPolicy;
}
export declare const generateDefaultUserPolicy: () => IamPolicy;
export declare const generateRootPolicy: () => IamPolicy;
export {};
