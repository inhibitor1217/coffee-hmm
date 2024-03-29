import {
  Policy,
  Exception,
  ExceptionCode,
  IamPolicy,
  OperationSchema,
  OperationType,
} from '@coffee-hmm/common';
import Joi from 'joi';
import { DeepPartial, getManager, getRepository } from 'typeorm';
import { FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } from 'pg-error-constants';
import { HTTP_CREATED, HTTP_OK } from '../../const';
import { SortOrder, SortOrderStrings } from '../../types';
import {
  TransformedSchemaTypes,
  TransformedVariablesMap,
} from '../../types/koa';
import { enumKeyStrings } from '../../util';
import handler from '../handler';

export const postPolicy = handler<
  TransformedVariablesMap,
  TransformedVariablesMap,
  {
    name: string;
    value: string;
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { name, value } = ctx.request.body;

    try {
      IamPolicy.parse(value);

      const connection = await ctx.state.connection();

      const inserted = await getRepository(Policy)
        .createQueryBuilder()
        .insert()
        .values({ name, value })
        .returning(Policy.columns)
        .execute()
        .then((insertResult) =>
          Policy.fromRawColumns(
            (insertResult.raw as DeepPartial<Policy>[])[0],
            { connection }
          )
        )
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

export const getSinglePolicy = handler<{
  policyId: string;
}>(
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

export const getPolicyCount = handler(
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

export const getPolicyList = handler<
  TransformedVariablesMap,
  {
    limit: number;
    cursor?: string;
    orderBy?: PolicyListOrderStrings;
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
    const orderBy = PolicyListOrder[orderByString];
    const order = SortOrder[orderString];

    const connection = await ctx.state.connection();

    let queryBuilder = getRepository(Policy)
      .createQueryBuilder('policy')
      .select();

    const comparator = order === SortOrder.asc ? '>' : '<';
    switch (orderBy) {
      case PolicyListOrder.updatedAt:
        queryBuilder = queryBuilder.addSelect(
          `CONCAT("policy"."updated_at", '.', "policy"."id") AS "cursor"`
        );
        if (cursor) {
          const splitPos = cursor.lastIndexOf('.');
          const cursorUpdatedAt = cursor.slice(0, splitPos);
          const cursorId = cursor.slice(splitPos + 1);
          queryBuilder = queryBuilder.where(
            `("policy"."updated_at", "policy"."id") ${comparator} (:updatedAt, :id)`,
            {
              updatedAt: cursorUpdatedAt,
              id: cursorId,
            }
          );
        }
        break;
      case PolicyListOrder.name:
        queryBuilder = queryBuilder.addSelect(`"policy"."name" AS "cursor"`);
        if (cursor) {
          queryBuilder = queryBuilder.where(
            `"policy"."name" ${comparator} :cursor`,
            { cursor }
          );
        }
        break;
      default:
        throw Error('invalid PolicyListOrder');
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

    const {
      policies,
      cursor: nextCursor,
    } = await queryBuilder
      .getRawMany()
      .then((rows: (DeepPartial<Policy> & { cursor: string })[]) => ({
        policies: rows.map((row) =>
          Policy.fromRawColumns(row, { alias: 'policy', connection })
        ),
        cursor: rows[rows.length - 1]?.cursor,
      }));

    ctx.status = HTTP_OK;
    ctx.body = {
      policy: {
        list: policies.map((policy) => policy.toJsonObject()),
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
          orderBy: Joi.string().valid(...enumKeyStrings(PolicyListOrder)),
          order: Joi.string().valid(...enumKeyStrings(SortOrder)),
        })
        .required(),
    },
    transform: {
      query: [{ key: 'limit', type: TransformedSchemaTypes.integer }],
    },
    requiredRules: new OperationSchema({
      operationType: OperationType.query,
      operation: 'auth.policy',
      resource: '*',
    }),
  }
);

export const putPolicy = handler<
  {
    policyId: string;
  },
  TransformedVariablesMap,
  {
    name?: string;
    value?: string;
  }
>(
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

      const connection = await ctx.state.connection();

      const repo = getRepository(Policy);
      const updated = await repo
        .createQueryBuilder()
        .update()
        .set(Object.filterUndefinedKeys({ name, value }))
        .where({ id: policyId })
        .returning(Policy.columns)
        .execute()
        .then((updateResult) => {
          if (!updateResult.affected) {
            throw new Exception(ExceptionCode.notFound);
          }

          return Policy.fromRawColumns(
            (updateResult.raw as Record<string, unknown>[])[0],
            { connection }
          );
        })
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

export const deletePolicy = handler<{
  policyId: string;
}>(
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
