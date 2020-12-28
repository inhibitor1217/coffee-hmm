import firebaseAdmin from 'firebase-admin';
import Joi from 'joi';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import { DeepPartial, getManager } from 'typeorm';
import { HTTP_CREATED, HTTP_OK } from '../const';
import Policy, { DEFAULT_USER_POLICY_NAME } from '../entities/policy';
import User, {
  AuthProvider,
  parseFirebaseSignInProvider,
  UserState,
} from '../entities/user';
import UserProfile from '../entities/userProfile';
import { KoaRouteHandler, VariablesMap } from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';
import { generateDefaultUserPolicy } from '../util/iam';
import { generateToken, TokenSubject } from '../util/token';
import handler from './handler';

const verifyFirebaseIdToken = async (idToken: string) => {
  try {
    const {
      uid: firebaseUid,
      email: firebaseUserEmail,
      firebase: { sign_in_provider: firebaseSignInProvider },
    } = await firebaseAdmin.auth().verifyIdToken(idToken);
    const authProvider = parseFirebaseSignInProvider(firebaseSignInProvider);

    return {
      provider: authProvider,
      providerUserId: firebaseUid,
      providerUserEmail: firebaseUserEmail,
    };
  } catch (e) {
    if (Exception.isExceptionOf(e, ExceptionCode.notImplemented)) {
      throw new Exception(ExceptionCode.unauthorized, e.message);
    }

    throw new Exception(
      ExceptionCode.unauthorized,
      'firebase id token verification failed'
    );
  }
};

export const register: KoaRouteHandler<
  VariablesMap,
  {
    id_token: string;
  },
  {
    profile: {
      name: string;
      email?: string;
    };
  }
> = handler(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const connection = await ctx.state.connection();

    const { id_token: idToken } = ctx.query;
    const {
      provider,
      providerUserId,
      providerUserEmail,
    } = await verifyFirebaseIdToken(idToken);

    const {
      profile: { name: profileName, email: profileEmail },
    } = ctx.request.body;

    await connection.transaction(async (manager) => {
      const userProfile = await manager
        .createQueryBuilder(UserProfile, 'user_profile')
        .insert()
        .values({
          name: profileName,
          email: profileEmail,
        })
        .returning(UserProfile.columns)
        .execute()
        .then((insertResult) =>
          UserProfile.fromRawColumns(
            (insertResult.raw as DeepPartial<UserProfile>[])[0]
          )
        );

      const userPolicy = await (async () => {
        const maybeDefaultUserPolicy = await manager
          .createQueryBuilder(Policy, 'policy')
          .select()
          .where({ name: DEFAULT_USER_POLICY_NAME })
          .getOne();

        if (maybeDefaultUserPolicy) {
          return maybeDefaultUserPolicy;
        }

        const defaultUserPolicy = await manager
          .createQueryBuilder(Policy, 'policy')
          .insert()
          .values({
            name: DEFAULT_USER_POLICY_NAME,
            value: JSON.stringify(generateDefaultUserPolicy().toJsonObject()),
          })
          .returning(Policy.columns)
          .execute()
          .then((insertResult) =>
            Policy.fromRawColumns(
              (insertResult.raw as DeepPartial<Policy>[])[0]
            )
          );

        return defaultUserPolicy;
      })();

      const user = await manager
        .createQueryBuilder(User, 'user')
        .insert()
        .values({
          fkUserProfileId: userProfile.id,
          fkPolicyId: userPolicy.id,
          state: UserState.active,
          provider,
          providerUserId,
          providerUserEmail,
        })
        .returning(User.columns)
        .execute()
        .then((insertResult) =>
          User.fromRawColumns((insertResult.raw as DeepPartial<User>[])[0])
        )
        .catch((e: { code: string }) => {
          if (e.code === UNIQUE_VIOLATION) {
            throw new Exception(ExceptionCode.badRequest, {
              message: `user already exists with given firebase credentials`,
            });
          }
          throw e;
        });

      ctx.status = HTTP_CREATED;
      ctx.body = {
        user: user.toJsonObject(),
      };
    });
  },
  {
    schema: {
      query: Joi.object()
        .keys({
          id_token: Joi.string().required(),
        })
        .required(),
      body: Joi.object()
        .keys({
          profile: Joi.object()
            .keys({
              name: Joi.string().min(1).max(30).required(),
              email: Joi.string().email(),
            })
            .required(),
        })
        .required(),
    },
  }
);

export const token: KoaRouteHandler<
  VariablesMap,
  {
    id_token: string;
  }
> = handler(
  async (ctx) => {
    await ctx.state.connection();

    const { id_token: idToken } = ctx.query;
    const { provider, providerUserId } = await verifyFirebaseIdToken(idToken);

    const user = await getManager()
      .createQueryBuilder(User, 'user')
      .select()
      .where({ provider, providerUserId })
      .getOne();

    if (!user) {
      throw new Exception(ExceptionCode.forbidden, {
        message: 'firebase user is not registered to service',
        provider: AuthProvider[provider],
        providerUserId,
      });
    }

    await getManager()
      .createQueryBuilder(User, 'user')
      .update()
      .set({ lastSignedAt: new Date(Date.now()) })
      .where({ id: user.id })
      .execute();

    switch (user.state) {
      case UserState.active: {
        const policy = await ctx.state.loaders.policy.load(user.fkPolicyId);

        const payload = {
          uid: user.id,
          policy: policy?.iamPolicy.toJsonObject(),
        };

        const accessToken = await generateToken<typeof payload>(payload, {
          subject: TokenSubject.accessToken,
          expiresIn: '1h',
        });

        ctx.status = HTTP_OK;
        ctx.body = { token: accessToken };
        break;
      }
      case UserState.deleted:
        throw new Exception(ExceptionCode.forbidden, {
          message: `user ${user.id} is deleted`,
        });
      default:
        throw Error(`invalid user.state`);
    }
  },
  {
    schema: {
      query: Joi.object()
        .keys({
          id_token: Joi.string().required(),
        })
        .required(),
    },
  }
);
