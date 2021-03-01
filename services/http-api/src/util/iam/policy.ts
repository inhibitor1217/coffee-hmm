import { IamRule, IamRuleObject, OperationSchema, OperationType } from '.';
import { KoaContextState } from '../../types/koa';
import Exception, { ExceptionCode } from '../error';

type IamPolicyParams = {
  rules: IamRule[];
};

export type IamPolicyObject = {
  rules: IamRuleObject[];
};

export default class IamPolicy {
  public rules: IamRule[];

  constructor(params: IamPolicyParams) {
    this.rules = params.rules;
  }

  public toJsonObject(): IamPolicyObject {
    return {
      rules: this.rules.map((rule) => rule.toJsonObject()),
    };
  }

  public canExecuteOperation(
    state: KoaContextState,
    schema: OperationSchema
  ): boolean {
    return this.rules.some((rule) => rule.canExecuteOperation(state, schema));
  }

  public canExecuteOperations(
    state: KoaContextState,
    schemas: OperationSchema[]
  ): boolean {
    return schemas.every((schema) => this.canExecuteOperation(state, schema));
  }

  static isValidPolicyJsonObject(json: AnyJson): json is IamPolicyObject {
    if (json === null || typeof json !== 'object' || Array.isArray(json)) {
      return false;
    }

    const { rules } = json;

    if (rules === null || typeof rules !== 'object' || !Array.isArray(rules)) {
      return false;
    }

    if (rules.length === 0) {
      return false;
    }

    if (!rules.every((rule) => IamRule.isValidRuleJsonObject(rule))) {
      return false;
    }

    return true;
  }

  static fromJsonObject(json: IamPolicyObject): IamPolicy {
    return new IamPolicy({
      rules: json.rules.map((rule) => IamRule.fromJsonObject(rule)),
    });
  }

  static parse(raw: string): IamPolicy {
    try {
      const json = JSON.parse(raw);

      if (!this.isValidPolicyJsonObject(json)) {
        throw new Exception(
          ExceptionCode.invalidArgument,
          `invalid iam policy statement: got ${raw}`
        );
      }

      return this.fromJsonObject(json);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Exception(ExceptionCode.invalidArgument, e.message);
      }
      throw e;
    }
  }
}

export const generateDefaultUserPolicy = () =>
  new IamPolicy({
    rules: [
      new IamRule({
        operationType: OperationType.query,
        operation: 'auth.user',
        resource: '[uid]',
      }),
      new IamRule({
        operationType: OperationType.mutation,
        operation: 'auth.user',
        resource: '[uid]',
      }),
      new IamRule({
        operationType: OperationType.query,
        operation: 'auth.user.profile',
        resource: '[uid]',
      }),
      new IamRule({
        operationType: OperationType.mutation,
        operation: 'auth.user.profile',
        resource: '[uid]',
      }),
      new IamRule({
        operationType: OperationType.query,
        operation: 'auth.user.policy',
        resource: '[uid]',
      }),
    ],
  });

export const generateRootPolicy = () =>
  new IamPolicy({
    rules: [
      new IamRule({ operationType: OperationType.query, operation: '*' }),
      new IamRule({ operationType: OperationType.mutation, operation: '*' }),
    ],
  });
