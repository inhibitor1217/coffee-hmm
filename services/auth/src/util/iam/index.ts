export { default as IamRule, IamRuleObject } from './rule';
export { default as IamPolicy, IamPolicyObject } from './policy';

export enum OperationType {
  query,
  mutation,
}

export type OperationTypeStrings = keyof typeof OperationType;

export const isOperationTypeString = (
  str: string
): str is OperationTypeStrings => str === 'query' || str === 'mutation';

export type OperationSchema = {
  operationType: OperationType;
  operation: string;
  resource: string;
};
