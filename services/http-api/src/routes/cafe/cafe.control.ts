import joi from 'joi';
import { FOREIGN_KEY_VIOLATION } from 'pg-error-constants';
import { Not } from 'typeorm';
import { HTTP_CREATED, HTTP_OK } from '../../const';
import Cafe, {
  CafeState,
  CafeStateStrings,
  createCafeWithImagesLoader,
} from '../../entities/cafe';
import CafeImageCount from '../../entities/cafeImageCount';
import CafeStatistic from '../../entities/cafeStatistic';
import { KoaRouteHandler, VariablesMap } from '../../types/koa';
import { enumKeyStrings } from '../../util';
import Exception, { ExceptionCode } from '../../util/error';
import { OperationSchema, OperationType } from '../../util/iam';
import handler from '../handler';

export const getOne = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const getFeed = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const getCount = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const getList = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const create: KoaRouteHandler<
  VariablesMap,
  VariablesMap,
  {
    name: string;
    placeId: string;
    metadata?: AnyJson;
    state?: CafeStateStrings;
  }
> = handler(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { name, placeId, metadata, state = 'hidden' } = ctx.request.body;

    const connection = await ctx.state.connection();

    const created = await connection.transaction(async (manager) => {
      const cafe = await manager
        .createQueryBuilder(Cafe, 'cafe')
        .insert()
        .values({
          name,
          fkPlaceId: placeId,
          metadata: metadata ? JSON.stringify(metadata) : null,
          state: CafeState[state],
        })
        .returning(Cafe.columns)
        .execute()
        .then((insertResult) =>
          Cafe.fromRawColumns(
            (insertResult.raw as Record<string, unknown>[])[0],
            { connection }
          )
        )
        .catch((e: { code: string }) => {
          if (e.code === FOREIGN_KEY_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `invalid place ${placeId}: place does not exist`
            );
          }
          throw e;
        });

      await manager
        .createQueryBuilder(CafeStatistic, 'cafe_statistic')
        .insert()
        .values({
          fkCafeId: cafe.id,
          dailyViews: 0,
          weeklyViews: 0,
          monthlyViews: 0,
          totalViews: 0,
          numReviews: 0,
          sumRatings: 0,
          numLikes: 0,
        })
        .execute();

      await manager
        .createQueryBuilder(CafeImageCount, 'cafe_image_count')
        .insert()
        .values({
          fkCafeId: cafe.id,
          total: 0,
          active: 0,
        })
        .execute();

      return createCafeWithImagesLoader(ctx, { manager }).load(cafe.id);
    });

    ctx.status = HTTP_CREATED;
    ctx.body = {
      cafe: created?.toJsonObject(),
    };
  },
  {
    schema: {
      body: joi
        .object()
        .keys({
          name: joi.string().min(1).max(255).required(),
          placeId: joi.string().uuid({ version: 'uuidv4' }).required(),
          metadata: joi.object(),
          state: joi.string().valid(...enumKeyStrings(CafeState)),
        })
        .required(),
    },
    requiredRules: new OperationSchema({
      operationType: OperationType.mutation,
      operation: 'api.cafe',
      resource: '*',
    }),
  }
);

export const updateOne: KoaRouteHandler<
  { cafeId: string },
  { showHiddenImages?: boolean },
  {
    name?: string;
    placeId?: string;
    metadata?: AnyJson;
    state?: CafeStateStrings;
  }
> = handler(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { cafeId } = ctx.params;
    const { showHiddenImages = false } = ctx.query;
    const { name, placeId, metadata, state } = ctx.request.body;

    const connection = await ctx.state.connection();

    const cafe = await connection.transaction(async (manager) => {
      const updated = await manager
        .createQueryBuilder(Cafe, 'cafe')
        .update()
        .set(
          Object.filterUndefinedKeys({
            name,
            fkPlaceId: placeId,
            metadata: metadata ? JSON.stringify(metadata) : metadata,
            state: state ? CafeState[state] : state,
          })
        )
        .where({ id: cafeId, state: Not(CafeState.deleted) })
        .returning(Cafe.columns)
        .execute()
        .then((updateResult) => {
          if (!updateResult.affected) {
            throw new Exception(ExceptionCode.notFound);
          }

          return Cafe.fromRawColumns(
            (updateResult.raw as Record<string, unknown>[])[0]
          );
        })
        .catch((e: { code: string }) => {
          if (e.code === FOREIGN_KEY_VIOLATION) {
            throw new Exception(
              ExceptionCode.badRequest,
              `invalid place ${placeId ?? ''}: place does not exist`
            );
          }
          throw e;
        });

      return createCafeWithImagesLoader(ctx, {
        manager,
        showHiddenImages,
      }).load(updated.id);
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: cafe?.toJsonObject(),
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({ cafeId: joi.string().uuid({ version: 'uuidv4' }).required() })
        .required(),
      query: joi.object().keys({ showHiddenImages: joi.boolean() }),
      body: joi
        .object()
        .keys({
          name: joi.string().min(1).max(255),
          placeId: joi.string().uuid({ version: 'uuidv4' }),
          metadata: joi.object().allow(null),
          state: joi.string().valid(...enumKeyStrings(CafeState)),
        })
        .or('name', 'placeId', 'metadata', 'state')
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.cafe',
        resource: ctx.params.cafeId,
      }),
  }
);
