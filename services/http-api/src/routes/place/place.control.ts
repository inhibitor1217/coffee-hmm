import {
  Cafe,
  Exception,
  ExceptionCode,
  Place,
  OperationSchema,
  OperationType,
} from '@coffee-hmm/common';
import joi from 'joi';
import { FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } from 'pg-error-constants';
import { getRepository, In } from 'typeorm';
import { HTTP_CREATED, HTTP_OK } from '../../const';
import {
  TransformedSchemaTypes,
  TransformedVariablesMap,
} from '../../types/koa';
import handler from '../handler';

export const getList = handler<TransformedVariablesMap, { pinned?: boolean }>(
  async (ctx) => {
    const { pinned = false } = ctx.query;

    await ctx.state.connection();

    let query = getRepository(Place).createQueryBuilder('place').select();

    if (pinned) {
      query = query.where({ pinned: true });
    }

    const places = await query.getMany();

    const placeIds = places.map((place) => place.id);
    const cafeCounts = await getRepository(Cafe)
      .createQueryBuilder('cafe')
      .select('cafe.fk_place_id AS "placeId", COUNT(cafe.id) AS "cafeCount"')
      .where({ fkPlaceId: In(placeIds) })
      .groupBy('cafe.fk_place_id')
      .getRawMany()
      .then((records: { placeId: string; cafeCount: string }[]) =>
        Array.normalize(
          records.map(({ placeId, cafeCount }) => ({
            placeId,
            cafeCount: parseInt(cafeCount, 10), // NOTE: getRawMany does not further process query result, so cafeCount is retrieved as string
          })),
          (record) => record.placeId
        )
      );

    // NOTE: sorting could be expensive, so consider doing the work at database instead of lambda instance
    const placeObjectsWithCafeCount = places
      .map((place) =>
        Object.assign(place.toJsonObject(), {
          cafeCount: cafeCounts[place.id]?.cafeCount ?? 0,
        })
      )
      .sort((one, other) => other.cafeCount - one.cafeCount);

    ctx.status = HTTP_OK;
    ctx.body = {
      place: {
        count: places.length,
        list: placeObjectsWithCafeCount,
      },
    };
  },
  {
    schema: {
      query: joi
        .object()
        .keys({
          pinned: joi.boolean(),
        })
        .required(),
    },
    transform: {
      query: [{ key: 'pinned', type: TransformedSchemaTypes.boolean }],
    },
  }
);

export const create = handler<
  TransformedVariablesMap,
  TransformedVariablesMap,
  { name: string; pinned?: boolean }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { name, pinned = false } = ctx.request.body;

    const connection = await ctx.state.connection();

    const inserted = await getRepository(Place)
      .createQueryBuilder()
      .insert()
      .values({ name, pinned })
      .returning(Place.columns)
      .execute()
      .then((insertResult) =>
        Place.fromRawColumns(
          (insertResult.raw as Record<string, unknown>[])[0],
          { connection }
        )
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
        .keys({
          name: joi.string().min(1).max(255).required(),
          pinned: joi.boolean(),
        })
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
  TransformedVariablesMap,
  { name?: string; pinned?: boolean }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { placeId } = ctx.params;
    const { name, pinned } = ctx.request.body;

    const connection = await ctx.state.connection();

    const place = await connection.transaction(async (manager) =>
      manager
        .createQueryBuilder(Place, 'place')
        .update()
        .set(Object.filterUndefinedKeys({ name, pinned }))
        .where({ id: placeId })
        .returning(Place.columns)
        .execute()
        .then((updatedResult) => {
          if (!updatedResult.affected) {
            throw new Exception(ExceptionCode.notFound);
          }

          return Place.fromRawColumns(
            (updatedResult.raw as Record<string, unknown>[])[0],
            { connection }
          );
        })
        .catch((e: { code: string }) => {
          if (e.code === UNIQUE_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `duplicate place name: ${name ?? 'undefined'}`
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
        .keys({ name: joi.string().min(1).max(255), pinned: joi.boolean() })
        .or('name', 'pinned')
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
  TransformedVariablesMap,
  TransformedVariablesMap,
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
