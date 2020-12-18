import Joi from 'joi';
import { getManager } from 'typeorm';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
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

      const { id } = await getManager()
        .createQueryBuilder(Policy, 'policy')
        .insert()
        .values({ name, value })
        .returning(['id'])
        .execute()
        .then((insertResult) => insertResult.generatedMaps[0] as { id: string })
        .catch((e: { code: string }) => {
          if (e.code === UNIQUE_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `duplicate policy name: ${name}`
            );
          }
          throw e;
        });

      const policy = await ctx.state.loaders.policy.load(id);

      ctx.status = HTTP_CREATED;
      ctx.body = {
        policy: policy.toJsonObject(),
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
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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
  () => {
    throw new Exception(ExceptionCode.notImplemented);
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
