import Joi from 'joi';
import { getManager, LessThan, MoreThan } from 'typeorm';
import { HTTP_OK } from '../../const';
import User, { UserState, UserStateStrings } from '../../entities/user';
import { SortOrder, SortOrderStrings } from '../../types';
import { KoaRouteHandler, VariablesMap } from '../../types/koa';
import { enumKeyStrings } from '../../util';
import Exception, { ExceptionCode } from '../../util/error';
import { OperationSchema, OperationType } from '../../util/iam';
import handler from '../handler';

export const getSingleUser: KoaRouteHandler<{
  userId: string;
}> = handler(
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

export const getUserCount: KoaRouteHandler = handler(
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

export const getUserList: KoaRouteHandler<
  VariablesMap,
  {
    limit: number;
    cursor?: string;
    orderBy?: UserListOrderStrings;
    order?: SortOrderStrings;
  }
> = handler(
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

    const entityOnCursor = cursor
      ? await getManager()
          .createQueryBuilder(User, 'user')
          .select()
          .where({ id: cursor })
          .getOne()
      : undefined;

    let queryBuilder = getManager().createQueryBuilder(User, 'user').select();

    if (entityOnCursor) {
      const comparator = order === SortOrder.asc ? MoreThan : LessThan;
      switch (orderBy) {
        case UserListOrder.updatedAt:
          queryBuilder = queryBuilder.where([
            {
              updatedAt: comparator(entityOnCursor.updatedAt),
            },
            {
              updatedAt: entityOnCursor.updatedAt,
              id: comparator(entityOnCursor.id),
            },
          ]);
          break;
        case UserListOrder.policy:
          queryBuilder = queryBuilder.where([
            {
              fkPolicyId: comparator(entityOnCursor.fkPolicyId),
            },
            {
              fkPolicyId: entityOnCursor.fkPolicyId,
              id: comparator(entityOnCursor.id),
            },
          ]);
          break;
        case UserListOrder.provider:
          queryBuilder = queryBuilder.where([
            {
              provider: comparator(entityOnCursor.provider),
            },
            {
              provider: entityOnCursor.provider,
              id: comparator(entityOnCursor.id),
            },
          ]);
          break;
        case UserListOrder.state:
          queryBuilder = queryBuilder.where([
            {
              state: comparator(entityOnCursor.state),
            },
            {
              state: entityOnCursor.state,
              id: comparator(entityOnCursor.id),
            },
          ]);
          break;
        default:
          throw Error('invalid UserListOrder');
      }
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
    queryBuilder.addOrderBy('user.id', order);

    queryBuilder = queryBuilder.limit(limit);

    const users = await queryBuilder.getMany();

    ctx.status = HTTP_OK;
    ctx.body = {
      user: {
        list: users.map((user) => user.toJsonObject()),
      },
    };
  },
  {
    schema: {
      query: Joi.object()
        .keys({
          limit: Joi.number().integer().min(1).max(64).required(),
          cursor: Joi.string().uuid({ version: 'uuidv4' }),
          orderBy: Joi.string().valid(...enumKeyStrings(UserListOrder)),
          order: Joi.string().valid(...enumKeyStrings(SortOrder)),
        })
        .required(),
    },
    requiredRules: new OperationSchema({
      operationType: OperationType.query,
      operation: 'auth.user',
      resource: '*',
    }),
  }
);

export const putUserState: KoaRouteHandler<
  {
    userId: string;
  },
  VariablesMap,
  {
    state: UserStateStrings;
  }
> = handler(
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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

export const getUserProfile: KoaRouteHandler<{
  userId: string;
}> = handler(
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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

export const putUserProfile: KoaRouteHandler<
  {
    userId: string;
  },
  VariablesMap,
  {
    name?: string;
    email?: string | null;
  }
> = handler(
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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

export const getUserPolicy: KoaRouteHandler<{
  userId: string;
}> = handler(
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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
