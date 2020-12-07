import { IamRule, IamRuleObject } from '.';

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
    const json = JSON.parse(raw);

    if (!this.isValidPolicyJsonObject(json)) {
      throw Error(`invalid iam policy statement: got ${raw}`);
    }

    return this.fromJsonObject(json);
  }
}
