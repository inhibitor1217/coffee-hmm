import {
  isOperationTypeString,
  OperationSchema,
  OperationType,
  OperationTypeStrings,
} from '.';

type IamRuleParams = {
  operationType: OperationType;
  operation: string;
  resource?: string;
};

export type IamRuleObject = {
  operationType: OperationTypeStrings;
  operation: string;
  resource: string;
};

export default class IamRule {
  public operationType: OperationType;

  public operation: string;

  public resource: string;

  constructor(params: IamRuleParams) {
    this.operationType = params.operationType;
    this.operation = params.operation;
    this.resource = params.resource ?? '*';
  }

  public toJsonObject(): IamRuleObject {
    return {
      operationType: OperationType[this.operationType] as OperationTypeStrings,
      operation: this.operation,
      resource: this.resource,
    };
  }

  public canExecuteOperation(schema: OperationSchema): boolean {
    return (
      this.operationType === schema.operationType &&
      this.operation === schema.operation &&
      (this.resource === '*' || this.resource === schema.resource)
    );
  }

  static isValidRuleJsonObject(json: AnyJson): json is IamRuleObject {
    if (json === null || typeof json !== 'object' || Array.isArray(json)) {
      return false;
    }

    const { operationType, operation, resource } = json;

    if (
      typeof operationType !== 'string' ||
      !isOperationTypeString(operationType)
    ) {
      return false;
    }

    if (typeof operation !== 'string' || operation.length === 0) {
      return false;
    }

    if (typeof resource !== 'string' && typeof resource !== 'undefined') {
      return false;
    }

    return true;
  }

  static fromJsonObject(json: IamRuleObject): IamRule {
    return new IamRule({
      operationType: OperationType[json.operationType],
      operation: json.operation,
      resource: json.resource ?? '*',
    });
  }
}
