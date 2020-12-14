import firebaseAdmin from 'firebase-admin';
import Joi from 'joi';
import { getRepository } from 'typeorm';
import { HTTP_CREATED } from '../const';
import Policy, { DEFAULT_USER_POLICY_NAME } from '../entities/policy';
import User, { parseFirebaseSignInProvider, UserState } from '../entities/user';
import UserProfile from '../entities/userProfile';
import { KoaRouteHandler, VariablesMap } from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';
import { generateDefaultUserPolicy } from '../util/iam';
import handler from './handler';

const verifyFirebaseIdToken = async (idToken: string) => {
  const {
    uid: firebaseUid,
    email: firebaseUserEmail,
    firebase: { sign_in_provider: firebaseSignInProvider },
  } = await firebaseAdmin.auth().verifyIdToken(idToken);
  try {
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

    throw e;
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
    const connection = await ctx.state.connection();

    const { id_token: idToken } = ctx.query;
    const {
      provider,
      providerUserId,
      providerUserEmail,
    } = await verifyFirebaseIdToken(idToken);

    const maybeExistingUser = await getRepository(User)
      .createQueryBuilder()
      .select()
      .where({ provider, providerUserId })
      .getOne();

    if (maybeExistingUser) {
      throw new Exception(ExceptionCode.badRequest, {
        message: `user already exists with given firebase credentials`,
        userId: maybeExistingUser.id,
      });
    }

    const profileName = ctx.request.body?.profile.name;
    const profileEmail = ctx.request.body?.profile.email;

    await connection.transaction(async (manager) => {
      const { id: fkUserProfileId } = await manager
        .createQueryBuilder(UserProfile, 'user_profile')
        .insert()
        .values({
          name: profileName,
          email: profileEmail,
        })
        .returning(['id'])
        .execute()
        .then(
          (insertResult) => insertResult.generatedMaps[0] as { id: string }
        );

      const fkPolicyId = await (async () => {
        const maybeDefaultUserPolicy = await manager
          .createQueryBuilder(Policy, 'policy')
          .select()
          .where({ name: DEFAULT_USER_POLICY_NAME })
          .getOne();

        if (maybeDefaultUserPolicy) {
          return maybeDefaultUserPolicy.id;
        }

        const defaultUserPolicy = await manager
          .createQueryBuilder(Policy, 'policy')
          .insert()
          .values({
            name: DEFAULT_USER_POLICY_NAME,
            value: JSON.stringify(generateDefaultUserPolicy().toJsonObject()),
          })
          .returning(['id'])
          .execute()
          .then(
            (insertResult) => insertResult.generatedMaps[0] as { id: string }
          );

        return defaultUserPolicy.id;
      })();

      const user = await manager
        .createQueryBuilder(User, 'user')
        .insert()
        .values({
          fkUserProfileId,
          fkPolicyId,
          state: UserState.active,
          provider,
          providerUserId,
          providerUserEmail,
        })
        .returning('*')
        .execute()
        .then((insertResult) => insertResult.generatedMaps[0] as User);

      ctx.status = HTTP_CREATED;
      ctx.body = {
        user: {
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastSignedAt: user.lastSignedAt,
          userProfileId: user.fkUserProfileId,
          policyId: user.fkPolicyId,
          state: user.stateString,
          provider: user.providerString,
          providerUserId: user.providerUserId,
          providerUserEmail: user.providerUserEmail,
        },
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
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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
