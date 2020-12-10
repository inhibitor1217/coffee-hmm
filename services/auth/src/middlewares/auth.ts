import { Middleware, Next, ParameterizedContext } from 'koa';
import firebaseAdmin from 'firebase-admin';
import { getRepository } from 'typeorm';
import { KoaContextState } from '../types/koa';
import { appStage, buildString, env } from '../util';
import { AppStage } from '../types/env';
import { IamPolicy } from '../util/iam';
import Exception, { ExceptionCode } from '../util/error';
import User, { parseFirebaseSignInProvider } from '../entities/user';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const bearerToken = /Bearer ([a-zA-Z0-9\-_.]+)/;
const parseBearerToken = (header: string): string =>
  (bearerToken.exec(header) || [])[1];

const invalidDebugUidErrorMessage = `Invalid debug user id. Debug user id should be given with valid UUID format.`;
const invalidDebugPolicyErrorMessage = `Invalid debug policy. Either valid debug iam policy string should be provided using [x-debug-iam-policy] header, or user of given id should already exist in the service, so that policy could be read from database.`;

const auth = (): Middleware<KoaContextState> => {
  let initialized = false;

  return async (ctx: ParameterizedContext<KoaContextState>, next: Next) => {
    if (!initialized) {
      const firebaseProjectName = `${env('APP_NAME')}-${env('APP_STAGE')}`;
      ctx.state.logger.verbose(
        `Initializing firebase project with project name: ${firebaseProjectName}`
      );

      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault(),
        databaseURL: `https://${firebaseProjectName}.firebaseio.com`,
      });
      ctx.state.logger.debug(`Initialized firebase project.`);

      initialized = true;
    }

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
          : await ctx.state.loaders.user
              .load(debugUserId)
              .then((user) => user?.policy?.iamPolicy);

        if (!debugIamPolicy) {
          throw new Exception(
            ExceptionCode.badRequest,
            invalidDebugPolicyErrorMessage
          );
        }

        return [debugUserId, debugIamPolicy];
      } catch (e) {
        if (Exception.isExceptionOf(e, ExceptionCode.invalidArgument)) {
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
      const idToken = parseBearerToken(ctx.get('Authorization'));
      if (idToken) {
        try {
          const {
            uid: firebaseUid,
            firebase: { sign_in_provider: firebaseSignInProvider },
          } = await firebaseAdmin.auth().verifyIdToken(idToken);
          const provider = parseFirebaseSignInProvider(firebaseSignInProvider);

          /* find user with given auth provider and provider uid. */
          await ctx.state.connection();
          const user = await getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.policy', 'policy')
            .where({ provider, providerUserId: firebaseUid })
            .getOne();

          if (!user) {
            throw new Exception(
              ExceptionCode.unauthorized,
              `user is not registered to ${buildString()} service`
            );
          }

          return [user.id, user.policy.iamPolicy];
        } catch (e) {
          if (Exception.isExceptionOf(e, ExceptionCode.notImplemented)) {
            throw new Exception(ExceptionCode.unauthorized, e.message);
          }

          throw e;
        }
      }

      return null;
    };

    const [uid, policy] =
      (await parseDebugHeaders()) ?? (await parseAuthorizationHeader()) ?? [];

    ctx.state.uid = uid;
    ctx.state.policy = policy;

    await next();
  };
};

export default auth;
