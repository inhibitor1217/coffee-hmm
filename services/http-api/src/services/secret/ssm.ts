import { SSM } from 'aws-sdk';
import SecretStorage from '.';
import { env } from '../../util';

export default class SsmSecretStorage implements SecretStorage {
  private ssm: SSM;

  private parameters?: SSM.ParameterList;

  constructor() {
    this.ssm = new SSM();
  }

  async get(key: string): Promise<string> {
    if (!this.parameters) {
      const { Parameters: parameters } = await this.ssm
        .getParametersByPath({
          Path: `/${env('APP_NAME')}/${env('APP_STAGE')}`,
          WithDecryption: true,
        })
        .promise();
      this.parameters = parameters;
    }

    const maybeValue = this.parameters?.find((param) =>
      param.Name?.includes(key)
    )?.Value;

    if (!maybeValue) {
      throw Error(`SSM parameter of key ${key} is not set`);
    }

    return maybeValue;
  }
}
