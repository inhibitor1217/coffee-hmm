export { default as IamRule, IamRuleObject } from './rule';
export {
  default as IamPolicy,
  generateDefaultUserPolicy,
  IamPolicyObject,
} from './policy';
export { default as OperationSchema, OperationSchemaObject } from './schema';

export enum OperationType {
  query,
  mutation,
}

export type OperationTypeStrings = keyof typeof OperationType;

export const isOperationTypeString = (
  str: string
): str is OperationTypeStrings => str === 'query' || str === 'mutation';
