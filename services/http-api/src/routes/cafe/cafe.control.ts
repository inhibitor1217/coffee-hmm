import joi from 'joi';
import { FOREIGN_KEY_VIOLATION } from 'pg-error-constants';
import { getManager, getRepository, In, Not } from 'typeorm';
import * as uuid from 'uuid';
import { HTTP_CREATED, HTTP_OK } from '../../const';
import Cafe, {
  CafeState,
  CafeStateStrings,
  createCafeWithImagesLoader,
} from '../../entities/cafe';
import CafeImage, { CafeImageState } from '../../entities/cafeImage';
import CafeImageCount from '../../entities/cafeImageCount';
import CafeStatistic from '../../entities/cafeStatistic';
import Place from '../../entities/place';
import { SortOrder, SortOrderStrings } from '../../types';
import {
  TransformedSchemaTypes,
  TransformedVariablesMap,
} from '../../types/koa';
import { enumKeyStrings } from '../../util';
import Exception, { ExceptionCode } from '../../util/error';
import { OperationSchema, OperationType } from '../../util/iam';
import handler from '../handler';

export const getOne = handler<
  {
    cafeId: string;
  },
  {
    showHiddenImages?: boolean;
  },
  AnyJson
>(
  async (ctx) => {
    const { cafeId } = ctx.params;
    const { showHiddenImages = false } = ctx.query;

    await ctx.state.connection();

    const cafe = await ctx.state.loaders
      .cafeWithImages({ showHiddenImages })
      .load(cafeId);

    if (!cafe) {
      throw new Exception(ExceptionCode.notFound);
    }

    if (cafe.state === CafeState.hidden) {
      /* check privilege for hidden cafe */
      if (
        !(
          ctx.state.policy?.canExecuteOperation(
            ctx.state,
            new OperationSchema({
              operationType: OperationType.query,
              operation: 'api.cafe.hidden',
              resource: '*',
            })
          ) ?? false
        )
      ) {
        throw new Exception(ExceptionCode.forbidden);
      }
    }

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: cafe.toJsonObject({ showHiddenImages }),
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({ cafeId: joi.string().uuid({ version: 'uuidv4' }).required() })
        .required(),
      query: joi.object().keys({ showHiddenImages: joi.boolean() }),
    },
    transform: {
      query: [
        { key: 'showHiddenImages', type: TransformedSchemaTypes.boolean },
      ],
    },
  }
);

export const getFeed = handler<
  TransformedVariablesMap,
  {
    limit: number;
    cursor?: string;
    identifier?: string;
    placeId?: string;
    placeName?: string;
  }
>(
  async (ctx) => {
    const {
      limit,
      cursor,
      identifier: _identifier,
      placeId,
      placeName,
    } = ctx.query;

    await ctx.state.connection();

    const identifier = _identifier ?? ctx.state.uid ?? uuid.v4();

    /**
     * TODO:  The following query sweeps through the entire table,
     *        which is necessary because of the computed column md5(concat("cafe"."id", :identifier::text)).
     *        This is inevitable due to the feature design, which required to show
     *        different cafe order for every users.
     *        If this ever becomes an issue, we should drop the feature and use indexed columns for ordering,
     *        or use caches (redis-like) for caching the results.
     */

    let query = getRepository(Cafe)
      .createQueryBuilder('cafe')
      .select()
      .addSelect(`md5(concat("cafe"."id", :identifier::text)) AS "cursor"`)
      .leftJoinAndSelect('cafe.place', 'place')
      .leftJoinAndSelect('cafe.statistic', 'cafe_statistic')
      .leftJoinAndSelect('cafe.imageCount', 'cafe_image_count')
      .setParameter('identifier', identifier)
      .where(`"cafe"."state" IS DISTINCT FROM :hidden`, {
        hidden: CafeState.hidden,
      })
      .andWhere(`"cafe"."state" IS DISTINCT FROM :deleted`, {
        deleted: CafeState.deleted,
      });

    if (cursor) {
      query = query.andWhere(
        `md5(concat("cafe"."id", :identifier::text)) > :cursor`,
        {
          cursor,
        }
      );
    }

    if (placeId) {
      query = query.andWhere('place.id = :placeId', { placeId });
    }

    if (placeName) {
      query = query.andWhere('place.name = :placeName', { placeName });
    }

    query = query.orderBy(`"cursor"`, 'ASC').limit(limit);

    const { cafes, cursor: nextCursor } = await query
      .getRawMany()
      .then((rows: (Record<string, unknown> & { cursor: string })[]) => ({
        cafes: rows.map((row) => {
          const cafe = Cafe.fromRawColumns(row, { alias: 'cafe' });
          cafe.place = Place.fromRawColumns(row, { alias: 'place' });
          cafe.statistic = CafeStatistic.fromRawColumns(row, {
            alias: 'cafe_statistic',
          });
          cafe.imageCount = CafeImageCount.fromRawColumns(row, {
            alias: 'cafe_image_count',
          });
          cafe.images = [];

          return cafe;
        }),
        cursor: rows[rows.length - 1]?.cursor,
      }));

    const cafeImages = await getRepository(CafeImage)
      .createQueryBuilder('cafe_image')
      .select()
      .where({
        fkCafeId: In(cafes.map((cafe) => cafe.id)),
        state: Not(In([CafeImageState.hidden, CafeImageState.deleted])),
      })
      .orderBy({ index: 'ASC' })
      .getMany();

    cafeImages.forEach((cafeImage) => {
      const cafe = cafes.find((item) => item.id === cafeImage.fkCafeId);
      cafe?.images.push(cafeImage);
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: {
        list: cafes.map((cafe) =>
          cafe.toJsonObject({ showHiddenImages: false })
        ),
      },
      cursor: nextCursor,
      identifier,
    };
  },
  {
    schema: {
      query: joi
        .object()
        .keys({
          limit: joi.number().integer().min(1).max(64).required(),
          cursor: joi.string(),
          identifier: joi.string().uuid({ version: 'uuidv4' }),
          placeId: joi.string().uuid({ version: 'uuidv4' }),
          placeName: joi.string().min(1).max(255),
        })
        .oxor('placeId', 'placeName')
        .required(),
    },
    transform: {
      query: [{ key: 'limit', type: TransformedSchemaTypes.integer }],
    },
  }
);

export const getCount = handler<
  TransformedVariablesMap,
  {
    keyword?: string;
    showHidden?: boolean;
  }
>(
  async (ctx) => {
    const { keyword, showHidden = false } = ctx.query;

    await ctx.state.connection();

    let query = getManager()
      .createQueryBuilder(Cafe, 'cafe')
      .leftJoinAndSelect('cafe.place', 'place')
      .where(`"cafe"."state" IS DISTINCT FROM :deleted`, {
        deleted: CafeState.deleted,
      });

    if (!showHidden) {
      query = query.andWhere(`"cafe"."state" IS DISTINCT FROM :hidden`, {
        hidden: CafeState.hidden,
      });
    }

    if (keyword) {
      query = query.andWhere(
        `("cafe"."name" LIKE :keyword OR "place"."name" LIKE :keyword)`,
        {
          keyword: `%${keyword}%`,
        }
      );
    }

    const count = await query.getCount();

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: { count },
    };
  },
  {
    schema: {
      query: joi.object().keys({
        keyword: joi.string().min(1).max(255),
        showHidden: joi.boolean(),
      }),
    },
    transform: {
      query: [{ key: 'showHidden', type: TransformedSchemaTypes.boolean }],
    },
    requiredRules: (ctx) => [
      ...(ctx.query.showHidden ?? false
        ? [
            new OperationSchema({
              operationType: OperationType.query,
              operation: 'api.cafe.hidden',
              resource: '*',
            }),
          ]
        : []),
    ],
  }
);

enum CafeListOrder {
  updatedAt = 0,
  name = 1,
  place = 2,
  state = 3,
  numImages = 4,
}

type CafeListOrderStrings = keyof typeof CafeListOrder;

export const getList = handler<
  TransformedVariablesMap,
  {
    limit: number;
    cursor?: string;
    orderBy?: CafeListOrderStrings;
    order?: SortOrderStrings;
    keyword?: string;
    showHidden?: boolean;
    showHiddenImages?: boolean;
  }
>(
  async (ctx) => {
    const {
      limit,
      cursor,
      orderBy: orderByString = 'updatedAt',
      order: orderString = 'asc',
      keyword,
      showHidden = false,
      showHiddenImages = false,
    } = ctx.query;
    const orderBy = CafeListOrder[orderByString];
    const order = SortOrder[orderString];

    await ctx.state.connection();

    let query = getRepository(Cafe)
      .createQueryBuilder('cafe')
      .select()
      .leftJoinAndSelect('cafe.place', 'place')
      .leftJoinAndSelect('cafe.statistic', 'cafe_statistic')
      .leftJoinAndSelect('cafe.imageCount', 'cafe_image_count');

    switch (orderBy) {
      case CafeListOrder.updatedAt:
        query = query.addSelect(
          `CONCAT(cafe.updated_at, '.', cafe.id) AS cursor`
        );
        break;
      case CafeListOrder.name:
        query = query.addSelect(`CONCAT(cafe.name, '.', cafe.id) AS cursor`);
        break;
      case CafeListOrder.place:
        query = query.addSelect(
          `CONCAT(cafe.fk_place_id, '.', cafe.id) AS cursor`
        );
        break;
      case CafeListOrder.state:
        query = query.addSelect(
          `CONCAT(LPAD((cafe.state + 32768)::text, 5, '0'), '.', cafe.id) AS cursor`
        );
        break;
      case CafeListOrder.numImages:
        query = query.addSelect(
          `CONCAT(LPAD(cafe_image_count.total::text, 12, '0'), '.', cafe.id) AS cursor`
        );
        break;
      default:
        throw Error('invalid CafeListOrder');
    }

    query = query.where(`TRUE`);

    if (cursor) {
      const comparator = order === SortOrder.asc ? '>' : '<';
      switch (orderBy) {
        case CafeListOrder.updatedAt: {
          const splitPos = cursor.lastIndexOf('.');
          const cursorUpdatedAt = cursor.slice(0, splitPos);
          const cursorId = cursor.slice(splitPos + 1);
          query = query.andWhere(
            `(cafe.updatedAt, cafe.id) ${comparator} (:updatedAt, :id)`,
            {
              updatedAt: cursorUpdatedAt,
              id: cursorId,
            }
          );
          break;
        }
        case CafeListOrder.name: {
          const splitPos = cursor.lastIndexOf('.');
          const cursorName = cursor.slice(0, splitPos);
          const cursorId = cursor.slice(splitPos + 1);
          query = query.andWhere(
            `(cafe.name, cafe.id) ${comparator} (:name, :id)`,
            { name: cursorName, id: cursorId }
          );
          break;
        }
        case CafeListOrder.place: {
          query = query.andWhere(
            `CONCAT(cafe.fk_place_id, '.', cafe.id) ${comparator} :cursor`,
            { cursor }
          );
          break;
        }
        case CafeListOrder.state: {
          query = query.andWhere(
            `CONCAT(LPAD((cafe.state + 32768)::text, 5, '0'), '.', cafe.id) ${comparator} :cursor`,
            { cursor }
          );
          break;
        }
        case CafeListOrder.numImages: {
          query = query.andWhere(
            `CONCAT(LPAD(cafe_image_count.total::text, 12, '0'), '.', cafe.id) ${comparator} :cursor`,
            { cursor }
          );
          break;
        }
        default:
          throw Error('invalid CafeListOrder');
      }
    }

    query = query.andWhere(`cafe.state IS DISTINCT FROM :deleted`, {
      deleted: CafeState.deleted,
    });

    if (!showHidden) {
      query = query.andWhere(`cafe.state is DISTINCT FROM :hidden`, {
        hidden: CafeState.hidden,
      });
    }

    if (keyword) {
      query = query.andWhere(
        `(cafe.name LIKE :keyword OR place.name LIKE :keyword)`,
        {
          keyword: `%${keyword}%`,
        }
      );
    }

    switch (orderBy) {
      case CafeListOrder.updatedAt:
        query = query.orderBy({ 'cafe.updatedAt': order });
        break;
      case CafeListOrder.name:
        query = query.orderBy({ 'cafe.name': order });
        break;
      case CafeListOrder.place:
        query = query.orderBy({ 'cafe.fk_place_id': order });
        break;
      case CafeListOrder.state:
        query = query.orderBy({ 'cafe.state': order });
        break;
      case CafeListOrder.numImages:
        query = query.orderBy({ 'cafe_image_count.total': order });
        break;
      default:
        throw Error('invalid CafeListOrder');
    }
    query = query.addOrderBy('cafe.id', order);

    query = query.limit(limit);

    const { cafes, cursor: nextCursor } = await query
      .getRawMany()
      .then((rows: (Record<string, unknown> & { cursor: string })[]) => ({
        cafes: rows.map((row) => {
          const cafe = Cafe.fromRawColumns(row, { alias: 'cafe' });
          cafe.place = Place.fromRawColumns(row, { alias: 'place' });
          cafe.statistic = CafeStatistic.fromRawColumns(row, {
            alias: 'cafe_statistic',
          });
          cafe.imageCount = CafeImageCount.fromRawColumns(row, {
            alias: 'cafe_image_count',
          });
          cafe.images = [];

          return cafe;
        }),
        cursor: rows[rows.length - 1]?.cursor,
      }));

    const cafeImages = await getRepository(CafeImage)
      .createQueryBuilder('cafe_image')
      .select()
      .where({
        fkCafeId: In(cafes.map((cafe) => cafe.id)),
        state: Not(
          In([
            ...(showHiddenImages ? [] : [CafeImageState.hidden]),
            CafeImageState.deleted,
          ])
        ),
      })
      .orderBy({ index: 'ASC' })
      .getMany();

    cafeImages.forEach((cafeImage) => {
      const cafe = cafes.find((item) => item.id === cafeImage.fkCafeId);
      cafe?.images.push(cafeImage);
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: {
        list: cafes.map((cafe) => cafe.toJsonObject({ showHiddenImages })),
      },
      cursor: nextCursor,
    };
  },
  {
    schema: {
      query: joi
        .object()
        .keys({
          limit: joi.number().integer().min(1).max(64),
          cursor: joi.string(),
          orderBy: joi.string().valid(...enumKeyStrings(CafeListOrder)),
          order: joi.string().valid(...enumKeyStrings(SortOrder)),
          keyword: joi.string().min(1).max(255),
          showHidden: joi.boolean(),
          showHiddenImages: joi.boolean(),
        })
        .required(),
    },
    transform: {
      query: [
        { key: 'limit', type: TransformedSchemaTypes.integer },
        { key: 'showHidden', type: TransformedSchemaTypes.boolean },
        { key: 'showHiddenImages', type: TransformedSchemaTypes.boolean },
      ],
    },
    requiredRules: (ctx) => [
      ...(ctx.query.showHidden ?? false
        ? [
            new OperationSchema({
              operationType: OperationType.query,
              operation: 'api.cafe.hidden',
              resource: '*',
            }),
          ]
        : []),
      ...(ctx.query.showHiddenImages ?? false
        ? [
            new OperationSchema({
              operationType: OperationType.query,
              operation: 'api.cafe.image.hidden',
              resource: '*',
            }),
          ]
        : []),
    ],
  }
);

export const create = handler<
  TransformedVariablesMap,
  TransformedVariablesMap,
  {
    name: string;
    placeId: string;
    metadata?: AnyJson;
    state?: CafeStateStrings;
  }
>(
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

      return createCafeWithImagesLoader(ctx.state, { manager }).load(cafe.id);
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
          state: joi
            .string()
            .valid(...enumKeyStrings(CafeState))
            .disallow(CafeState[CafeState.deleted]),
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

export const updateOne = handler<
  { cafeId: string },
  { showHiddenImages?: boolean },
  {
    name?: string;
    placeId?: string;
    metadata?: AnyJson;
    state?: CafeStateStrings;
  }
>(
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

      return createCafeWithImagesLoader(ctx.state, {
        manager,
        showHiddenImages,
      }).load(updated.id);
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: cafe?.toJsonObject({ showHiddenImages }),
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
          state: joi
            .string()
            .valid(...enumKeyStrings(CafeState))
            .disallow(CafeState[CafeState.deleted]),
        })
        .or('name', 'placeId', 'metadata', 'state')
        .required(),
    },
    transform: {
      query: [
        { key: 'showHiddenImages', type: TransformedSchemaTypes.boolean },
      ],
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.cafe',
        resource: ctx.params.cafeId,
      }),
  }
);
