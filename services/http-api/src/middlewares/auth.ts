import {
  generateRootPolicy,
  IamPolicy,
  IamPolicyObject,
  Exception,
  ExceptionCode,
} from '@coffee-hmm/common';
import { Middleware, Next, ParameterizedContext } from 'koa';
import service from '../services';
import { AppStage } from '../types/env';
import { KoaContextState } from '../types/koa';
import { appStage, env } from '../util';
import { TokenSubject, verifyToken } from '../util/token';

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const bearerToken = /^Bearer ([a-zA-Z0-9\-_.]+)$/i;
const parseBearerToken = (header: string): string =>
  (bearerToken.exec(header) || [])[1];

const invalidDebugUidErrorMessage = `Invalid debug user id. Debug user id should be given with valid UUID format.`;
const invalidDebugPolicyErrorMessage = `Invalid debug policy. Either valid debug iam policy string should be provided using [x-debug-iam-policy] header, or user of given id should already exist in the service, so that policy could be read from auth microservice.`;

const auth = (): Middleware<KoaContextState> => {
  return async (ctx: ParameterizedContext<KoaContextState>, next: Next) => {
    const parseDebugHeaders = async (): Promise<[string, IamPolicy] | null> => {
      if (appStage() !== AppStage.local) {
        return null;
      }

      /* enable debug headers */
      try {
        const debugUserId = ctx.get('x-debug-user-id') || null;

        if (!debugUserId) {
          return null;
        }

        if (!uuid.test(debugUserId)) {
          throw new Exception(
            ExceptionCode.badRequest,
            invalidDebugUidErrorMessage
          );
        }

        const rawDebugIamPolicy = ctx.get('x-debug-iam-policy');
        const debugIamPolicy = rawDebugIamPolicy
          ? IamPolicy.parse(rawDebugIamPolicy)
          : await service().auth().getUserPolicy(debugUserId);

        if (!debugIamPolicy) {
          throw new Exception(
            ExceptionCode.badRequest,
            invalidDebugPolicyErrorMessage
          );
        }

        return [debugUserId, debugIamPolicy];
      } catch (e) {
        if (
          Exception.isExceptionOf(e, ExceptionCode.invalidArgument) ||
          Exception.isExceptionOf(e, ExceptionCode.service)
        ) {
          throw new Exception(
            ExceptionCode.badRequest,
            invalidDebugPolicyErrorMessage
          );
        }
        throw e;
      }
    };

    const parseAuthorizationHeader = async (): Promise<
      [string, IamPolicy] | null
    > => {
      const accessToken = parseBearerToken(ctx.get('Authorization'));
      if (accessToken) {
        const { uid, policy } = await verifyToken<{
          uid: string;
          policy: IamPolicyObject;
        }>(accessToken, {
          subject: TokenSubject.accessToken,
        });

        return [uid, IamPolicy.fromJsonObject(policy)];
      }

      return null;
    };

    const [uid, policy] =
      (await parseDebugHeaders()) ?? (await parseAuthorizationHeader()) ?? [];

    ctx.state.uid = uid;
    ctx.state.policy = policy;

    try {
      /* try to override with root policy if root uid feature is enabled */
      const rootUid =
        appStage() === AppStage.local
          ? env('ROOT_UID')
          : await service().secret().get('ROOT_UID');

      if (rootUid === uid) {
        ctx.state.policy = generateRootPolicy();
        ctx.state.logger.info(`user ${uid} executing as root policy`);
      }
    } catch (e) {
      /* pass */
    }

    await next();
  };
};

export default auth;
