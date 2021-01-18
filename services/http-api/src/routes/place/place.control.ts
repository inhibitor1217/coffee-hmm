import joi from 'joi';
import { FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } from 'pg-error-constants';
import { getRepository } from 'typeorm';
import { HTTP_CREATED, HTTP_OK } from '../../const';
import Place from '../../entities/place';
import { VariablesMap } from '../../types/koa';
import Exception, { ExceptionCode } from '../../util/error';
import { OperationSchema, OperationType } from '../../util/iam';
import handler from '../handler';

export const getList = handler(async (ctx) => {
  await ctx.state.connection();

  const places = await getRepository(Place)
    .createQueryBuilder('place')
    .select()
    .getMany();

  ctx.status = HTTP_OK;
  ctx.body = {
    place: {
      count: places.length,
      list: places.map((place) => place.toJsonObject()),
    },
  };
});

export const create = handler<VariablesMap, VariablesMap, { name: string }>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { name } = ctx.request.body;

    await ctx.state.connection();

    const inserted = await getRepository(Place)
      .createQueryBuilder()
      .insert()
      .values({ name })
      .returning(Place.columns)
      .execute()
      .then((insertResult) =>
        Place.fromRawColumns((insertResult.raw as Record<string, unknown>[])[0])
      )
      .catch((e: { code: string }) => {
        if (e.code === UNIQUE_VIOLATION) {
          throw new Exception(
            ExceptionCode.badRequest,
            `duplicate place name: ${name}`
          );
        }
        throw e;
      });

    ctx.status = HTTP_CREATED;
    ctx.body = {
      place: inserted.toJsonObject(),
    };
  },
  {
    schema: {
      body: joi
        .object()
        .keys({ name: joi.string().min(1).max(255).required() })
        .required(),
    },
    requiredRules: new OperationSchema({
      operationType: OperationType.mutation,
      operation: 'api.place',
      resource: '*',
    }),
  }
);

export const updateOne = handler<
  { placeId: string },
  VariablesMap,
  { name: string }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { placeId } = ctx.params;
    const { name } = ctx.request.body;

    const connection = await ctx.state.connection();

    const place = await connection.transaction(async (manager) =>
      manager
        .createQueryBuilder(Place, 'place')
        .update()
        .set({ name })
        .where({ id: placeId })
        .returning(Place.columns)
        .execute()
        .then((updatedResult) => {
          if (!updatedResult.affected) {
            throw new Exception(ExceptionCode.notFound);
          }

          return Place.fromRawColumns(
            (updatedResult.raw as Record<string, unknown>[])[0]
          );
        })
        .catch((e: { code: string }) => {
          if (e.code === UNIQUE_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `duplicate place name: ${name}`
            );
          }
          throw e;
        })
    );

    ctx.status = HTTP_OK;
    ctx.body = {
      place: place.toJsonObject(),
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({ placeId: joi.string().uuid({ version: 'uuidv4' }).required() })
        .required(),
      body: joi
        .object()
        .keys({ name: joi.string().min(1).max(255).required() })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.place',
        resource: ctx.params.placeId,
      }),
  }
);

export const deleteList = handler<
  VariablesMap,
  VariablesMap,
  {
    list: string[];
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { list } = ctx.request.body;

    const connection = await ctx.state.connection();

    await connection.transaction((manager) =>
      manager
        .createQueryBuilder(Place, 'place')
        .delete()
        .whereInIds(list)
        .execute()
        .then((deleteResult) => {
          if ((deleteResult.affected ?? 0) < list.length) {
            throw new Exception(ExceptionCode.notFound);
          }
        })
        .catch((e: { code: string }) => {
          if (e.code === FOREIGN_KEY_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `one of given places has connected cafe to it`
            );
          }
          throw e;
        })
    );

    ctx.status = HTTP_OK;
    ctx.body = {
      place: {
        list: list.map((id) => ({ id })),
      },
    };
  },
  {
    schema: {
      body: joi
        .object()
        .keys({
          list: joi
            .array()
            .items(joi.string().uuid({ version: 'uuidv4' }))
            .required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      ctx.request.body?.list?.map(
        (placeId) =>
          new OperationSchema({
            operationType: OperationType.mutation,
            operation: 'api.place',
            resource: placeId,
          })
      ) ?? [],
  }
);

export const deleteOne = handler<{ placeId: string }>(
  async (ctx) => {
    const { placeId } = ctx.params;

    const connection = await ctx.state.connection();

    await connection.transaction((manager) =>
      manager
        .createQueryBuilder(Place, 'place')
        .delete()
        .where({ id: placeId })
        .execute()
        .then((deleteResult) => {
          if (!deleteResult.affected) {
            throw new Exception(ExceptionCode.notFound);
          }
        })
        .catch((e: { code: string }) => {
          if (e.code === FOREIGN_KEY_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `place ${placeId} has cafe connected to it`
            );
          }
          throw e;
        })
    );

    ctx.status = HTTP_OK;
    ctx.body = {
      place: {
        id: placeId,
      },
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({ placeId: joi.string().uuid({ version: 'uuidv4' }).required() })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.place',
        resource: ctx.params.placeId,
      }),
  }
);
