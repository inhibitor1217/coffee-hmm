import axios, { AxiosInstance } from 'axios';
import PolicyModel, { PolicyModelObject } from '../../models/Policy';
import { env, logLevel } from '../../util';
import Exception, { ExceptionCode } from '../../util/error';
import { IamPolicy, IamRule, OperationType } from '../../util/iam';
import Logger from '../../util/logger';
import { generateToken, TokenSubject } from '../../util/token';

export default class AuthService {
  private policy: IamPolicy;

  private tokenExpiration: Date | undefined;

  private instance: AxiosInstance;

  private logger: Logger;

  constructor() {
    this.policy = new IamPolicy({
      rules: [
        new IamRule({
          operationType: OperationType.query,
          operation: 'auth.user.policy',
        }),
      ],
    });

    this.instance = axios.create({ baseURL: env('AUTH_SERVICE') });
    this.logger = new Logger(logLevel());
  }

  private async refreshToken(): Promise<void> {
    if (this.tokenExpiration && new Date() > this.tokenExpiration) {
      return;
    }

    this.logger.info('Refreshing access token ...');

    const payload = {
      uid: 'MICROSERICE@HTTP_API',
      policy: this.policy.toJsonObject(),
    };

    const accessToken = await generateToken<typeof payload>(payload, {
      subject: TokenSubject.accessToken,
      expiresIn: '1h',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    this.tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);
  }

  async getUserPolicy(userId: string): Promise<IamPolicy> {
    await this.refreshToken();

    try {
      const response = await this.instance.get<{
        user: { policy: PolicyModelObject };
      }>(`/user/${userId}/policy`);
      const {
        user: { policy: policyModel },
      } = response.data;

      if (!PolicyModel.isValidModel(policyModel)) {
        throw new Exception(ExceptionCode.service, {
          msg: 'parsing response body failed',
        });
      }

      const policy = PolicyModel.fromJsonObject(policyModel);

      return policy.iamPolicy;
    } catch (e) {
      throw new Exception(ExceptionCode.service, e);
    }
  }
}

export const getAuthService: () => AuthService = (() => {
  let instance: AuthService | undefined;

  return () => {
    if (!instance) {
      instance = new AuthService();
    }
    return instance;
  };
})();
