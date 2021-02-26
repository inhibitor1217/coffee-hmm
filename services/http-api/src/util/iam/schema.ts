import { OperationType, OperationTypeStrings } from '.';

type OperationSchemaParams = {
  operationType: OperationType;
  operation: string;
  resource: string;
};

export type OperationSchemaObject = {
  operationType: OperationTypeStrings;
  operation: string;
  resource: string;
};

export default class OperationSchema {
  public operationType: OperationType;

  public operation: string;

  public resource: string;

  constructor(params: OperationSchemaParams) {
    this.operationType = params.operationType;
    this.operation = params.operation;
    this.resource = params.resource;
  }

  public toJsonObject(): OperationSchemaObject {
    return {
      operationType: OperationType[this.operationType] as OperationTypeStrings,
      operation: this.operation,
      resource: this.resource,
    };
  }
}
