import { OperationType, OperationTypeStrings } from '.';
declare type OperationSchemaParams = {
    operationType: OperationType;
    operation: string;
    resource: string;
};
export declare type OperationSchemaObject = {
    operationType: OperationTypeStrings;
    operation: string;
    resource: string;
};
export default class OperationSchema {
    operationType: OperationType;
    operation: string;
    resource: string;
    constructor(params: OperationSchemaParams);
    toJsonObject(): OperationSchemaObject;
}
export {};
