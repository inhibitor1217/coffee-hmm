import { SSM } from 'aws-sdk';
import SecretStorage from '.';
import { env } from '../../util';

function getValue(
  ssmParameterList: SSM.ParameterList | undefined,
  key: string
): string | undefined {
  return ssmParameterList?.find(({ Name }) => Name?.endsWith(key) ?? false)
    ?.Value;
}

export default class SsmSecretStorage implements SecretStorage {
  private ssm: SSM;

  constructor() {
    this.ssm = new SSM();
  }

  async get(key: string): Promise<string> {
    const parameters = await this.readParameters(
      `/${env('APP_NAME')}/${env('APP_STAGE')}`
    );

    const value = getValue(parameters, key);

    if (!value) {
      throw Error(
        `SSM parameter of key ${key} is not set in application context`
      );
    }

    return value;
  }

  async getGlobal(key: string): Promise<string> {
    const parameters = await this.readParameters(
      `/${env('SECRET_GLOBAL_VARIABLE_PREFIX')}/${env('APP_STAGE')}`
    );

    const value = getValue(parameters, key);

    if (!value) {
      throw Error(`SSM parameter of key ${key} is not set in global context`);
    }

    return value;
  }

  private readParameters(
    pathPrefix: string
  ): Promise<SSM.ParameterList | undefined> {
    return this.ssm
      .getParametersByPath({
        Path: pathPrefix,
        WithDecryption: true,
      })
      .promise()
      .then(({ Parameters }) => Parameters);
  }
}
