import Joi from 'joi';
import { getManager, getRepository, LessThan, MoreThan } from 'typeorm';
import { FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } from 'pg-error-constants';
import { HTTP_CREATED, HTTP_OK } from '../../const';
import Policy from '../../entities/policy';
import { SortOrder, SortOrderStrings } from '../../types';
import { KoaRouteHandler, VariablesMap } from '../../types/koa';
import { enumKeyStrings } from '../../util';
import Exception, { ExceptionCode } from '../../util/error';
import { IamPolicy, OperationSchema, OperationType } from '../../util/iam';
import handler from '../handler';

export const postPolicy: KoaRouteHandler<
  VariablesMap,
  VariablesMap,
  {
    name: string;
    value: string;
  }
> = handler(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { name, value } = ctx.request.body;

    try {
      IamPolicy.parse(value);

      await ctx.state.connection();

      const repo = getRepository(Policy);
      const inserted = await repo
        .createQueryBuilder()
        .insert()
        .values({ name, value })
        .returning(Policy.columns)
        .execute()
        .then((insertResult) => repo.create(insertResult.generatedMaps[0]))
        .catch((e: { code: string }) => {
          if (e.code === UNIQUE_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `duplicate policy name: ${name}`
            );
          }
          throw e;
        });

      ctx.status = HTTP_CREATED;
      ctx.body = {
        policy: inserted.toJsonObject(),
      };
    } catch (e) {
      if (Exception.isExceptionOf(e, ExceptionCode.invalidArgument)) {
        throw new Exception(ExceptionCode.badRequest, e.message);
      }
      throw e;
    }
  },
  {
    schema: {
      body: Joi.object()
        .keys({
          name: Joi.string().min(4).max(30).required(),
          value: Joi.string().required(),
        })
        .required(),
    },
    requiredRules: new OperationSchema({
      operationType: OperationType.mutation,
      operation: 'auth.policy',
      resource: '*',
    }),
  }
);

export const getSinglePolicy: KoaRouteHandler<{
  policyId: string;
}> = handler(
  async (ctx) => {
    const { policyId } = ctx.params;

    await ctx.state.connection();

    const policy = await ctx.state.loaders.policy.load(policyId);

    if (!policy) {
      throw new Exception(ExceptionCode.notFound);
    }

    ctx.status = HTTP_OK;
    ctx.body = {
      policy: policy.toJsonObject(),
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          policyId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.query,
        operation: 'auth.policy',
        resource: ctx.params.policyId,
      }),
  }
);

export const getPolicyCount: KoaRouteHandler = handler(
  async (ctx) => {
    await ctx.state.connection();

    const count = await getManager()
      .createQueryBuilder(Policy, 'policy')
      .getCount();

    ctx.status = HTTP_OK;
    ctx.body = {
      policy: {
        count,
      },
    };
  },
  {
    requiredRules: new OperationSchema({
      operationType: OperationType.query,
      operation: 'auth.policy',
      resource: '*',
    }),
  }
);

enum PolicyListOrder {
  updatedAt = 0,
  name = 1,
}

type PolicyListOrderStrings = keyof typeof PolicyListOrder;

export const getPolicyList: KoaRouteHandler<
  VariablesMap,
  {
    limit: number;
    cursor?: string;
    orderBy?: PolicyListOrderStrings;
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
    const orderBy = PolicyListOrder[orderByString];
    const order = SortOrder[orderString];

    await ctx.state.connection();

    const entityOnCursor = cursor
      ? await ctx.state.loaders.policy.load(cursor)
      : undefined;

    // TODO: implement cursor-based pagination by using generated columns
    // TODO: return cursor value and next page invokation uri at response

    let queryBuilder = getManager()
      .createQueryBuilder(Policy, 'policy')
      .select();

    if (entityOnCursor) {
      const comparator = order === SortOrder.asc ? MoreThan : LessThan;
      switch (orderBy) {
        case PolicyListOrder.updatedAt:
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
        case PolicyListOrder.name:
          queryBuilder = queryBuilder.where({
            name: comparator(entityOnCursor.name),
          });
          break;
        default:
          throw Error('invalid PolicyListOrder');
      }
    }

    switch (orderBy) {
      case PolicyListOrder.updatedAt:
        queryBuilder = queryBuilder.orderBy({ 'policy.updatedAt': order });
        break;
      case PolicyListOrder.name:
        queryBuilder = queryBuilder.orderBy({ 'policy.name': order });
        break;
      default:
        throw Error('invalid PolicyListOrder');
    }
    queryBuilder = queryBuilder.addOrderBy('policy.id', order);

    queryBuilder = queryBuilder.limit(limit);

    const policies = await queryBuilder.getMany();

    ctx.status = HTTP_OK;
    ctx.body = {
      policy: {
        list: policies.map((policy) => policy.toJsonObject()),
      },
    };
  },
  {
    schema: {
      query: Joi.object()
        .keys({
          limit: Joi.number().integer().min(1).max(64).required(),
          cursor: Joi.string().uuid({ version: 'uuidv4' }),
          orderBy: Joi.string().valid(...enumKeyStrings(PolicyListOrder)),
          order: Joi.string().valid(...enumKeyStrings(SortOrder)),
        })
        .required(),
    },
    requiredRules: new OperationSchema({
      operationType: OperationType.query,
      operation: 'auth.policy',
      resource: '*',
    }),
  }
);

export const putPolicy: KoaRouteHandler<
  {
    policyId: string;
  },
  VariablesMap,
  {
    name?: string;
    value?: string;
  }
> = handler(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { policyId } = ctx.params;
    const { name, value } = ctx.request.body;

    try {
      if (value) {
        IamPolicy.parse(value);
      }

      await ctx.state.connection();

      const repo = getRepository(Policy);
      const updated = await repo
        .createQueryBuilder()
        .update()
        .set({ ...{ name, value } })
        .where({ id: policyId })
        .returning(Policy.columns)
        .execute()
        .then((updateResult) =>
          Policy.fromRawColumns(
            (updateResult.raw as Record<string, unknown>[])[0]
          )
        )
        .catch((e: { code: string }) => {
          if (e.code === UNIQUE_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `duplicate policy name: ${name ?? '(undefined)'}`
            );
          }
          throw e;
        });

      ctx.status = HTTP_OK;
      ctx.body = {
        policy: updated.toJsonObject(),
      };
    } catch (e) {
      if (Exception.isExceptionOf(e, ExceptionCode.invalidArgument)) {
        throw new Exception(ExceptionCode.badRequest, e.message);
      }
      throw e;
    }
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          policyId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
      body: Joi.object()
        .keys({
          name: Joi.string().min(4).max(30),
          value: Joi.string(),
        })
        .or('name', 'value')
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'auth.policy',
        resource: ctx.params.policyId,
      }),
  }
);

export const deletePolicy: KoaRouteHandler<{
  policyId: string;
}> = handler(
  async (ctx) => {
    const { policyId } = ctx.params;

    await ctx.state.connection();

    const repo = getRepository(Policy);
    const affected = await repo
      .createQueryBuilder()
      .delete()
      .where({ id: policyId })
      .execute()
      .then((updateResult) => updateResult.affected)
      .catch((e: { code: string }) => {
        if (e.code === FOREIGN_KEY_VIOLATION) {
          throw new Exception(
            ExceptionCode.badRequest,
            `policy ${policyId} is still referenced from users`
          );
        }
        throw e;
      });

    if (!affected) {
      throw new Exception(ExceptionCode.notFound);
    }

    ctx.status = HTTP_OK;
    ctx.body = {
      policy: {
        id: policyId,
      },
    };
  },
  {
    schema: {
      params: Joi.object()
        .keys({
          policyId: Joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'auth.policy',
        resource: ctx.params.policyId,
      }),
  }
);
