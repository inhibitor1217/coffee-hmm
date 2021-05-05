import { OperationSchema, OperationType, OperationTypeStrings } from '.';
import { PolicyExecutionContext } from './interface';
declare type IamRuleParams = {
    operationType: OperationType;
    operation: string;
    resource?: string;
};
export declare type IamRuleObject = {
    operationType: OperationTypeStrings;
    operation: string;
    resource: string;
};
export default class IamRule {
    operationType: OperationType;
    operation: string;
    resource: string;
    constructor(params: IamRuleParams);
    toJsonObject(): IamRuleObject;
    private compareOperationHierarchy;
    private compareOperation;
    canExecuteOperation(state: PolicyExecutionContext, schema: OperationSchema): boolean;
    static isValidRuleJsonObject(json: AnyJson): json is IamRuleObject;
    static fromJsonObject(json: IamRuleObject): IamRule;
}
export {};
