import '../../util/extension';

import Joi from 'joi';
import { FOREIGN_KEY_VIOLATION } from 'pg-error-constants';
import { DeepPartial, getManager, getRepository } from 'typeorm';
import { HTTP_OK } from '../../const';
import User, { UserState, UserStateStrings } from '../../entities/user';
import UserProfile from '../../entities/userProfile';
import { SortOrder, SortOrderStrings } from '../../types';
import {
  TransformedSchemaTypes,
  TransformedVariablesMap,
} from '../../types/koa';
import { enumKeyStrings } from '../../util';
import Exception, { ExceptionCode } from '../../util/error';
import { OperationSchema, OperationType } from '../../util/iam';
import handler from '../handler';

export const getSingleUser = handler<{
  userId: string;
}>(
  async (ctx) => {
    await ctx.state.connection();

    const { userId } = ctx.params;

    const user = await ctx.state.loaders.user.load(userId);

    if (!user) {
      throw new Exception(ExceptionCode.notFound);
    }

    ctx.status = HTTP_OK;
    ctx.body = {
      user: user.toJsonObject(),
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          userId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.query,
        operation: 'auth.user',
        resource: ctx.params.userId,
      }),
  }
);

export const getUserCount = handler(
  async (ctx) => {
    await ctx.state.connection();

    const count = await getManager()
      .createQueryBuilder(User, 'user')
      .getCount();

    ctx.status = HTTP_OK;
    ctx.body = {
      user: {
        count,
      },
    };
  },
  {
    requiredRules: new OperationSchema({
      operationType: OperationType.query,
      operation: 'auth.user',
      resource: '*',
    }),
  }
);

enum UserListOrder {
  updatedAt = 0,
  policy = 1,
  provider = 2,
  state = 3,
}

type UserListOrderStrings = keyof typeof UserListOrder;

export const getUserList = handler<
  TransformedVariablesMap,
  {
    limit: number;
    cursor?: string;
    orderBy?: UserListOrderStrings;
    order?: SortOrderStrings;
  }
>(
  async (ctx) => {
    const {
      limit,
      cursor,
      orderBy: orderByString = 'updatedAt',
      order: orderString = 'asc',
    } = ctx.query;
    const orderBy = UserListOrder[orderByString];
    const order = SortOrder[orderString];

    await ctx.state.connection();

    let queryBuilder = getRepository(User).createQueryBuilder('user').select();

    const comparator = order === SortOrder.asc ? '>' : '<';
    switch (orderBy) {
      case UserListOrder.updatedAt:
        queryBuilder = queryBuilder.addSelect(
          `CONCAT("user"."updated_at", '.', "user"."id") AS "cursor"`
        );
        if (cursor) {
          const splitPos = cursor.lastIndexOf('.');
          const cursorUpdatedAt = cursor.slice(0, splitPos);
          const cursorId = cursor.slice(splitPos + 1);
          queryBuilder = queryBuilder.where(
            `("user"."updated_at", "user"."id") ${comparator} (:updatedAt, :id)`,
            { updatedAt: cursorUpdatedAt, id: cursorId }
          );
        }
        break;
      case UserListOrder.policy:
        queryBuilder = queryBuilder.addSelect(
          `CONCAT("user"."fk_policy_id", '.', "user"."id") AS "cursor"`
        );
        if (cursor) {
          queryBuilder = queryBuilder.where(
            `CONCAT("user"."fk_policy_id", '.', "user"."id") ${comparator} :cursor`,
            { cursor }
          );
        }
        break;
      case UserListOrder.provider:
        queryBuilder = queryBuilder.addSelect(
          `CONCAT(LPAD(("user"."provider" + 32768)::text, 5, '0'), '.', "user"."id") AS "cursor"`
        );
        if (cursor) {
          queryBuilder = queryBuilder.where(
            `CONCAT(LPAD(("user"."provider" + 32768)::text, 5, '0'), '.', "user"."id") ${comparator} :cursor`,
            { cursor }
          );
        }
        break;
      case UserListOrder.state:
        queryBuilder = queryBuilder.addSelect(
          `CONCAT(LPAD(("user"."state" + 32768)::text, 5, '0'), '.', "user"."id") AS "cursor"`
        );
        if (cursor) {
          queryBuilder = queryBuilder.where(
            `CONCAT(LPAD(("user"."state" + 32768)::text, 5, '0'), '.', "user"."id") ${comparator} :cursor`,
            { cursor }
          );
        }
        break;
      default:
        throw Error('invalid UserListOrder');
    }

    switch (orderBy) {
      case UserListOrder.updatedAt:
        queryBuilder = queryBuilder.orderBy({ 'user.updatedAt': order });
        break;
      case UserListOrder.policy:
        queryBuilder = queryBuilder.orderBy({ 'user.fkPolicyId': order });
        break;
      case UserListOrder.provider:
        queryBuilder = queryBuilder.orderBy({ 'user.provider': order });
        break;
      case UserListOrder.state:
        queryBuilder = queryBuilder.orderBy({ 'user.state': order });
        break;
      default:
        throw Error('invalid UserListOrder');
    }
    queryBuilder = queryBuilder.addOrderBy('user.id', order);

    queryBuilder = queryBuilder.limit(limit);

    const { users, cursor: nextCursor } = await queryBuilder
      .getRawMany()
      .then((rows: (DeepPartial<User> & { cursor: string })[]) => ({
        users: rows.map((row) => User.fromRawColumns(row, { alias: 'user' })),
        cursor: rows[rows.length - 1]?.cursor,
      }));

    ctx.status = HTTP_OK;
    ctx.body = {
      user: {
        list: users.map((user) => user.toJsonObject()),
      },
      cursor: nextCursor,
    };
  },
  {
    schema: {
      query: Joi.object()
        .keys({
          limit: Joi.number().integer().min(1).max(64).required(),
          cursor: Joi.string(),
          orderBy: Joi.string().valid(...enumKeyStrings(UserListOrder)),
          order: Joi.string().valid(...enumKeyStrings(SortOrder)),
        })
        .required(),
    },
    transform: {
      query: [{ key: 'limit', type: TransformedSchemaTypes.integer }],
    },
    requiredRules: new OperationSchema({
      operationType: OperationType.query,
      operation: 'auth.user',
      resource: '*',
    }),
  }
);

export const putUserState = handler<
  {
    userId: string;
  },
  TransformedVariablesMap,
  {
    state: UserStateStrings;
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { userId } = ctx.params;
    const state = UserState[ctx.request.body.state];

    await ctx.state.connection();

    const repo = getRepository(User);
    const updated = await repo
      .createQueryBuilder()
      .update()
      .set({ state })
      .where({ id: userId })
      .returning(User.columns)
      .execute()
      .then((updateResult) =>
        User.fromRawColumns((updateResult.raw as Record<string, unknown>[])[0])
      );

    ctx.status = HTTP_OK;
    ctx.body = {
      user: updated.toJsonObject(),
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          userId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
      body: Joi.object()
        .keys({
          state: Joi.string()
            .valid(...enumKeyStrings(UserState))
            .required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'auth.user',
        resource: ctx.params.userId,
      }),
  }
);

export const getUserProfile = handler<{
  userId: string;
}>(
  async (ctx) => {
    const { userId } = ctx.params;

    await ctx.state.connection();

    const profile = await ctx.state.loaders.userProfile.load(userId);

    ctx.status = HTTP_OK;
    ctx.body = {
      user: {
        profile: profile.toJsonObject(),
      },
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          userId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.query,
        operation: 'auth.user.profile',
        resource: ctx.params.userId,
      }),
  }
);

export const putUserProfile = handler<
  {
    userId: string;
  },
  TransformedVariablesMap,
  {
    name?: string;
    email?: string | null;
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { userId } = ctx.params;
    const { name, email } = ctx.request.body;

    await ctx.state.connection();

    const user = await ctx.state.loaders.user.load(userId);

    const updated = await getManager()
      .createQueryBuilder(UserProfile, 'user_profile')
      .update()
      .set(Object.filterUndefinedKeys({ name, email }))
      .where({ id: user.fkUserProfileId })
      .returning(UserProfile.columns)
      .execute()
      .then((updateResult) =>
        UserProfile.fromRawColumns(
          (updateResult.raw as Record<string, unknown>[])[0]
        )
      );

    ctx.status = HTTP_OK;
    ctx.body = {
      user: {
        profile: updated.toJsonObject(),
      },
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          userId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
      body: Joi.object()
        .keys({
          name: Joi.string().min(1).max(30),
          email: Joi.string().email().allow(null),
        })
        .or('name', 'email')
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'auth.user.profile',
        resource: ctx.params.userId,
      }),
  }
);

export const getUserPolicy = handler<{
  userId: string;
}>(
  async (ctx) => {
    const { userId } = ctx.params;

    await ctx.state.connection();

    const policy = await ctx.state.loaders.userPolicy.load(userId);

    if (!policy) {
      throw new Exception(ExceptionCode.notFound);
    }

    ctx.status = HTTP_OK;
    ctx.body = {
      user: {
        policy: policy.toJsonObject(),
      },
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          userId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.query,
        operation: 'auth.user.policy',
        resource: ctx.params.userId,
      }),
  }
);

export const putUserPolicy = handler<
  {
    userId: string;
  },
  TransformedVariablesMap,
  {
    policyId: string;
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { userId } = ctx.params;
    const { policyId } = ctx.request.body;

    await ctx.state.connection();

    const updated = await getManager()
      .createQueryBuilder(User, 'user')
      .update()
      .set({ fkPolicyId: policyId })
      .where({ id: userId })
      .returning(User.columns)
      .execute()
      .then((updateResult) => {
        if (updateResult?.affected) {
          return User.fromRawColumns(
            (updateResult.raw as Record<string, unknown>[])[0]
          );
        }
        throw new Exception(ExceptionCode.notFound);
      })
      .catch((e: { code: string }) => {
        if (e.code === FOREIGN_KEY_VIOLATION) {
          throw new Exception(
            ExceptionCode.badRequest,
            `policy not found: ${policyId}`
          );
        }
        throw e;
      });

    const policy = await ctx.state.loaders.policy.load(updated.fkPolicyId);

    ctx.status = HTTP_OK;
    ctx.body = {
      user: {
        policy: policy.toJsonObject(),
      },
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          userId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
      body: Joi.object()
        .keys({
          policyId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'auth.user.policy',
        resource: ctx.params.userId,
      }),
  }
);
