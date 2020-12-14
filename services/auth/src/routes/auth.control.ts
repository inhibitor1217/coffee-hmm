import firebaseAdmin from 'firebase-admin';
import Joi from 'joi';
import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HTTP_CREATED } from '../const';
import Policy from '../entities/policy';
import User, { parseFirebaseSignInProvider, UserState } from '../entities/user';
import UserProfile from '../entities/userProfile';
import { KoaRouteHandler, VariablesMap } from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';
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
    policy: {
      id?: string;
      name?: string;
      value?: string;
    };
  }
> = handler(
  async (ctx) => {
    await ctx.state.connection();

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
    const policyId = ctx.request.body?.policy.id;
    const policyName = ctx.request.body?.policy.name;
    const policyValue = ctx.request.body?.policy.value;

    const { id: fkUserProfileId } = await getRepository(UserProfile)
      .createQueryBuilder()
      .insert()
      .values({
        name: profileName,
        email: profileEmail,
      })
      .returning(['id'])
      .execute()
      .then((insertResult) => insertResult.generatedMaps[0] as { id: string });

    const fkPolicyId = await (async () => {
      if (policyId) {
        return policyId;
      }

      if (policyName) {
        const policy = await getRepository(Policy)
          .createQueryBuilder()
          .select()
          .where({ name: policyName })
          .getOne();

        if (!policy) {
          throw new Exception(
            ExceptionCode.badRequest,
            `policy with given id does not exist`
          );
        }

        return policy.id;
      }

      if (policyValue) {
        const policy = await getRepository(Policy)
          .createQueryBuilder()
          .insert()
          .values({
            name: `Policy@TEMP_${uuidv4()}`,
            value: policyValue,
          })
          .returning(['id'])
          .execute()
          .then(
            (insertResult) => insertResult.generatedMaps[0] as { id: string }
          );

        await getRepository(Policy)
          .createQueryBuilder()
          .update()
          .set({ name: `Policy@${policy.id}` })
          .where({ id: policy.id })
          .execute();

        return policy.id;
      }

      throw new Error('Unreachable code');
    })();

    const user = await getRepository(User)
      .createQueryBuilder()
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
          policy: Joi.object()
            .keys({
              id: Joi.string().uuid({ version: 'uuidv4' }),
              name: Joi.string().min(1).max(30),
              value: Joi.string(),
            })
            .xor('id', 'name', 'value')
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
