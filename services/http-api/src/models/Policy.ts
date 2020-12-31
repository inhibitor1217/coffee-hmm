import { Model } from '.';
import { IamPolicy, IamPolicyObject } from '../util/iam';

type PolicyModelParams = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  value: string;
  iamPolicy: IamPolicy;
};

export type PolicyModelObject = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  value: string;
} & IamPolicyObject;

export default class PolicyModel implements Model {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  value: string;

  iamPolicy: IamPolicy;

  constructor(params: PolicyModelParams) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.name = params.name;
    this.value = params.value;
    this.iamPolicy = params.iamPolicy;
  }

  public toJsonObject(): AnyJson {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      name: this.name,
      value: this.value,
      ...this.iamPolicy.toJsonObject(),
    };
  }

  static isValidModel(json: AnyJson): json is PolicyModelObject {
    if (json === null || typeof json !== 'object' || Array.isArray(json)) {
      return false;
    }

    const { id, createdAt, updatedAt, name, value, ...iamPolicyObject } = json;

    if (
      typeof id !== 'string' ||
      typeof createdAt !== 'string' ||
      typeof updatedAt !== 'string' ||
      typeof name !== 'string' ||
      typeof value !== 'string' ||
      !IamPolicy.isValidPolicyJsonObject(iamPolicyObject)
    ) {
      return false;
    }

    return true;
  }

  static fromJsonObject(json: PolicyModelObject): PolicyModel {
    const { id, createdAt, updatedAt, name, value, ...iamPolicyObject } = json;
    return new PolicyModel({
      id,
      createdAt: new Date(Date.parse(createdAt)),
      updatedAt: new Date(Date.parse(updatedAt)),
      name,
      value,
      iamPolicy: IamPolicy.fromJsonObject(iamPolicyObject),
    });
  }
}
