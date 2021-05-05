export { PolicyExecutionContext } from './interface';
export { default as IamRule, IamRuleObject } from './rule';
export { default as IamPolicy, generateDefaultUserPolicy, generateRootPolicy, IamPolicyObject, } from './policy';
export { default as OperationSchema, OperationSchemaObject } from './schema';
export declare enum OperationType {
    query = 0,
    mutation = 1
}
export declare type OperationTypeStrings = keyof typeof OperationType;
export declare const isOperationTypeString: (str: string) => str is "query" | "mutation";
