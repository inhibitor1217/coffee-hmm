import joi from 'joi';
import { FOREIGN_KEY_VIOLATION } from 'pg-error-constants';
import { EntityManager } from 'typeorm';
import { HTTP_CREATED, HTTP_OK } from '../../../const';
import CafeImage, {
  CafeImageState,
  CafeImageStateStrings,
} from '../../../entities/cafeImage';
import CafeImageCount from '../../../entities/cafeImageCount';
import { TransformedVariablesMap } from '../../../types/koa';
import { enumKeyStrings } from '../../../util';
import Exception, { ExceptionCode } from '../../../util/error';
import { OperationSchema, OperationType } from '../../../util/iam';
import handler from '../../handler';

export const create = handler<
  { cafeId: string },
  TransformedVariablesMap,
  {
    uri: string;
    metadata?: AnyJson;
    state?: CafeImageStateStrings;
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { cafeId } = ctx.params;
    const { uri, metadata, state: stateString = 'hidden' } = ctx.request.body;
    const state = CafeImageState[stateString];

    const connection = await ctx.state.connection();

    const cafeImage = await connection.transaction(async (manager) => {
      const cafeImages = await manager
        .createQueryBuilder(CafeImage, 'cafe_image')
        .select()
        .where(`cafe_image.fk_cafe_id = :cafeId`, { cafeId })
        .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
          deleted: CafeImageState.deleted,
        })
        .orderBy(`cafe_image.index`, 'DESC')
        .getMany();

      const nextIndex = (cafeImages[0]?.index ?? -1) + 1;
      const hasMainImage = cafeImages.reduce(
        (acc, cur) => acc || cur.isMain,
        false
      );

      const created = await manager
        .createQueryBuilder(CafeImage, 'cafe_image')
        .insert()
        .values({
          fkCafeId: cafeId,
          index: nextIndex,
          isMain: !hasMainImage,
          metadata: metadata ? JSON.stringify(metadata) : null,
          relativeUri: uri,
          state,
        })
        .returning(CafeImage.columns)
        .execute()
        .then((insertResult) =>
          CafeImage.fromRawColumns(
            (insertResult.raw as Record<string, unknown>[])[0]
          )
        )
        .catch((e: { code: string }) => {
          if (e.code === FOREIGN_KEY_VIOLATION) {
            throw new Exception(
              ExceptionCode.notFound,
              `cafe ${cafeId} does not exist`
            );
          }
          throw e;
        });

      await manager
        .createQueryBuilder()
        .update(CafeImageCount)
        .set({
          total: () => `"total" + 1`,
          active: () =>
            state === CafeImageState.active ? `"active" + 1` : `"active"`,
        })
        .where(`cafe_image_counts.fk_cafe_id = :cafeId`, { cafeId })
        .execute();

      return created;
    });

    ctx.status = HTTP_CREATED;
    ctx.body = {
      cafe: {
        id: cafeId,
        image: cafeImage?.toJsonObject(),
      },
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({ cafeId: joi.string().uuid({ version: 'uuidv4' }).required() })
        .required(),
      body: joi.object().keys({
        uri: joi.string().min(1).max(255).required(),
        metadata: joi.object(),
        state: joi
          .string()
          .valid(...enumKeyStrings(CafeImageState))
          .disallow(CafeImageState[CafeImageState.deleted]),
      }),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.cafe.image',
        resource: ctx.params.cafeId,
      }),
  }
);

const checkConsistency = async (manager: EntityManager, cafeId: string) => {
  const images = await manager
    .createQueryBuilder(CafeImage, 'cafe_image')
    .select()
    .where(`cafe_image.fk_cafe_id = :cafeId`, { cafeId })
    .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
      deleted: CafeImageState.deleted,
    })
    .orderBy(`cafe_image.index`, 'ASC')
    .getMany();

  /* exactly one among the active images should be main image. */
  const activeImages = images.filter(
    (image) => image.state === CafeImageState.active
  );
  const hiddenImages = images.filter(
    (image) => image.state === CafeImageState.hidden
  );

  if (hiddenImages.some((image) => image.isMain)) {
    throw new Exception(
      ExceptionCode.badRequest,
      `inconsistent state: hidden image is set as main image`
    );
  }

  if (activeImages.length > 0) {
    const numMainImages = activeImages.reduce(
      (acc, cur) => acc + (cur.isMain ? 1 : 0),
      0
    );

    if (numMainImages > 1) {
      throw new Exception(
        ExceptionCode.badRequest,
        `inconsistent state: there are more than one main image`
      );
    }
    if (numMainImages < 1) {
      throw new Exception(
        ExceptionCode.badRequest,
        `inconsistent state: there is no main image`
      );
    }
  }

  /* the indices should be correctly labeled */
  images.forEach((image, index) => {
    if (image.index !== index) {
      throw new Exception(
        ExceptionCode.badRequest,
        `inconsistent state: wrong indices applied to images`
      );
    }
  });

  return { images, total: images.length, active: activeImages.length };
};

export const updateList = handler<
  {
    cafeId: string;
  },
  TransformedVariablesMap,
  {
    list: {
      id: string;
      index?: number;
      isMain?: boolean;
    }[];
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { cafeId } = ctx.params;
    const { list } = ctx.request.body;

    const connection = await ctx.state.connection();

    const images = await connection.transaction(async (manager) => {
      const [, affected] = (await manager.query(
        `UPDATE "cafe_images" SET
  "index" = COALESCE("cafe_images_updated"."index"::smallint, "cafe_images"."index"),
  "is_main" = COALESCE("cafe_images_updated"."is_main"::boolean, "cafe_images"."is_main")
  FROM (VALUES ${list
    .map(
      ({ id, index, isMain }) =>
        `('${id}'::uuid, ${index ?? 'NULL'}, ${((
          value: boolean | undefined
        ) => {
          switch (value) {
            case true:
              return 'TRUE';
            case false:
              return 'FALSE';
            default:
              return 'NULL';
          }
        })(isMain)})`
    )
    .join(', ')}) AS "cafe_images_updated"("id", "index", "is_main")
  WHERE "cafe_images_updated"."id" = "cafe_images"."id"
    AND "cafe_images"."state" IS DISTINCT FROM ${CafeImageState.deleted}
    AND "cafe_images"."fk_cafe_id" = '${cafeId}'::uuid`
      )) as [never[], number];

      if (affected < list.length) {
        throw new Exception(ExceptionCode.notFound);
      }

      const { images: cafeImages, total, active } = await checkConsistency(
        manager,
        cafeId
      );

      await manager
        .createQueryBuilder()
        .update(CafeImageCount)
        .set({ total, active })
        .where(`cafe_image_counts.fk_cafe_id = :cafeId`, { cafeId })
        .execute();

      return cafeImages;
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: {
        id: cafeId,
        image: {
          count: images.length,
          list: images.map((cafe) => cafe.toJsonObject()),
        },
      },
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({ cafeId: joi.string().uuid({ version: 'uuidv4' }).required() })
        .required(),
      body: joi
        .object()
        .keys({
          list: joi
            .array()
            .items(
              joi.object().keys({
                id: joi.string().uuid({ version: 'uuidv4' }).required(),
                index: joi.number().integer().min(0),
                isMain: joi.boolean(),
              })
            )
            .required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.cafe.image',
        resource: ctx.params.cafeId,
      }),
  }
);

export const updateOne = handler<
  {
    cafeId: string;
    cafeImageId: string;
  },
  TransformedVariablesMap,
  {
    uri?: string;
    metadata?: AnyJson | null;
    state?: CafeImageStateStrings;
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { cafeId, cafeImageId } = ctx.params;
    const { uri, metadata, state: stateString } = ctx.request.body;
    const state = stateString ? CafeImageState[stateString] : stateString;

    const connection = await ctx.state.connection();

    const updated = await connection.transaction(async (manager) => {
      const cafeImages = await manager
        .createQueryBuilder(CafeImage, 'cafe_image')
        .select()
        .where(`cafe_image.fk_cafe_id = :cafeId`, { cafeId })
        .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
          deleted: CafeImageState.deleted,
        })
        .orderBy(`cafe_image.index`, 'ASC')
        .getMany();

      const originalCafeImage = cafeImages.find(
        (cafeImage) => cafeImage.id === cafeImageId
      );
      const shouldUpdateAsMain =
        originalCafeImage?.state === CafeImageState.hidden &&
        state === CafeImageState.active &&
        !cafeImages.reduce((acc, image) => acc || image.isMain, false);

      const updatedCafeImage = await manager
        .createQueryBuilder()
        .update(CafeImage)
        .set(
          Object.filterUndefinedKeys({
            relativeUri: uri,
            metadata: metadata ? JSON.stringify(metadata) : metadata,
            state,
            isMain: shouldUpdateAsMain ? true : undefined,
          })
        )
        .where(`cafe_images.id = :cafeImageId`, { cafeImageId })
        .andWhere(`cafe_images.fk_cafe_id = :cafeId`, { cafeId })
        .andWhere(`cafe_images.state IS DISTINCT FROM :deleted`, {
          deleted: CafeImageState.deleted,
        })
        .returning(CafeImage.columns)
        .execute()
        .then((updateResult) => {
          if (!updateResult.affected) {
            throw new Exception(ExceptionCode.notFound);
          }

          return CafeImage.fromRawColumns(
            (updateResult.raw as Record<string, unknown>[])[0]
          );
        });

      const { total, active } = await checkConsistency(manager, cafeId);

      await manager
        .createQueryBuilder()
        .update(CafeImageCount)
        .set({ total, active })
        .where(`cafe_image_counts.fk_cafe_id = :cafeId`, { cafeId })
        .execute();

      return updatedCafeImage;
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: {
        id: cafeId,
        image: updated?.toJsonObject(),
      },
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({
          cafeId: joi.string().uuid({ version: 'uuidv4' }).required(),
          cafeImageId: joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
      body: joi
        .object()
        .keys({
          uri: joi.string().min(1).max(255),
          metadata: joi.object().allow(null),
          state: joi
            .string()
            .valid(...enumKeyStrings(CafeImageState))
            .disallow(CafeImageState[CafeImageState.deleted]),
        })
        .or('uri', 'metadata', 'state')
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.cafe.image',
        resource: ctx.params.cafeImageId,
      }),
  }
);

const reassignIndices = async (manager: EntityManager, cafeId: string) => {
  const cafeImages = await manager
    .createQueryBuilder(CafeImage, 'cafe_image')
    .select()
    .where(`cafe_image.fk_cafe_id = :cafeId`, { cafeId })
    .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
      deleted: CafeImageState.deleted,
    })
    .orderBy(`cafe_image.index`, 'ASC')
    .getMany();

  await manager.query(
    `UPDATE "cafe_images" SET
  "index" = "cafe_images_updated"."index"
  FROM (VALUES ${cafeImages
    .map((image, index) => `('${image.id}'::uuid, ${index})`)
    .join(', ')}) AS "cafe_images_updated"("id", "index")
  WHERE "cafe_images_updated"."id" = "cafe_images"."id"`
  );
};

export const deleteList = handler<
  {
    cafeId: string;
  },
  TransformedVariablesMap,
  {
    list: string[];
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { cafeId } = ctx.params;
    const { list } = ctx.request.body;

    const connection = await ctx.state.connection();

    await connection.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(CafeImage)
        .set({
          state: CafeImageState.deleted,
        })
        .whereInIds(list)
        .andWhere(`cafe_images.fk_cafe_id = :cafeId`, { cafeId })
        .andWhere(`cafe_images.state IS DISTINCT FROM :deleted`, {
          deleted: CafeImageState.deleted,
        })
        .returning(CafeImage.columns)
        .execute()
        .then((updateResult) => {
          if ((updateResult.affected ?? 0) < list.length) {
            throw new Exception(ExceptionCode.notFound);
          }
          return (updateResult.raw as Record<string, unknown>[]).map((raw) =>
            CafeImage.fromRawColumns(raw)
          );
        });

      await reassignIndices(manager, cafeId);
      const { total, active } = await checkConsistency(manager, cafeId);

      await manager
        .createQueryBuilder()
        .update(CafeImageCount)
        .set({ total, active })
        .where(`cafe_image_counts.fk_cafe_id = :cafeId`, { cafeId })
        .execute();
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: {
        id: cafeId,
        image: {
          list: list.map((id) => ({ id })),
        },
      },
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({ cafeId: joi.string().uuid({ version: 'uuidv4' }).required() })
        .required(),
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
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.cafe.image',
        resource: ctx.params.cafeId,
      }),
  }
);

export const deleteOne = handler<{
  cafeId: string;
  cafeImageId: string;
}>(
  async (ctx) => {
    const { cafeId, cafeImageId } = ctx.params;

    const connection = await ctx.state.connection();

    const deletedImageId = await connection.transaction(async (manager) => {
      const deletedImage = await manager
        .createQueryBuilder()
        .update(CafeImage)
        .set({
          state: CafeImageState.deleted,
        })
        .where(`cafe_images.id = :cafeImageId`, { cafeImageId })
        .andWhere(`cafe_images.fk_cafe_id = :cafeId`, { cafeId })
        .andWhere(`cafe_images.state IS DISTINCT FROM :deleted`, {
          deleted: CafeImageState.deleted,
        })
        .returning(CafeImage.columns)
        .execute()
        .then((updateResult) => {
          if (!updateResult.affected) {
            throw new Exception(ExceptionCode.notFound);
          }
          return CafeImage.fromRawColumns(
            (updateResult.raw as Record<string, unknown>[])[0]
          );
        });

      await reassignIndices(manager, cafeId);
      const { total, active } = await checkConsistency(manager, cafeId);

      await manager
        .createQueryBuilder()
        .update(CafeImageCount)
        .set({ total, active })
        .where(`cafe_image_counts.fk_cafe_id = :cafeId`, { cafeId })
        .execute();

      return deletedImage.id;
    });

    ctx.status = HTTP_OK;
    ctx.body = {
      cafe: {
        id: cafeId,
        image: {
          list: [
            {
              id: deletedImageId,
            },
          ],
        },
      },
    };
  },
  {
    schema: {
      params: joi
        .object()
        .keys({
          cafeId: joi.string().uuid({ version: 'uuidv4' }).required(),
          cafeImageId: joi.string().uuid({ version: 'uuidv4' }).required(),
        })
        .required(),
    },
    requiredRules: (ctx) =>
      new OperationSchema({
        operationType: OperationType.mutation,
        operation: 'api.cafe.image',
        resource: ctx.params.cafeImageId,
      }),
  }
);
