import { SSM } from 'aws-sdk';
import SecretStorage from '.';
import { env } from '../../util';

export default class SsmSecretStorage implements SecretStorage {
  private ssm: SSM;

  constructor() {
    this.ssm = new SSM();
  }

  async get(key: string): Promise<string> {
    const { Parameters: parameters } = await this.ssm
      .getParametersByPath({
        Path: `/${env('APP_NAME')}/${env('APP_STAGE')}`,
        WithDecryption: true,
      })
      .promise();

    const maybeValue = parameters?.find((param) => param.Name?.includes(key))
      ?.Value;

    if (!maybeValue) {
      throw Error(`SSM parameter of key ${key} is not set`);
    }

    return maybeValue;
  }
}
