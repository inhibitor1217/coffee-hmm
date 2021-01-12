import joi from 'joi';
import { FOREIGN_KEY_VIOLATION } from 'pg-error-constants';
import { EntityManager, getManager } from 'typeorm';
import { HTTP_CREATED, HTTP_OK } from '../../../const';
import CafeImage, {
  CafeImageState,
  CafeImageStateStrings,
} from '../../../entities/cafeImage';
import { KoaRouteHandler, VariablesMap } from '../../../types/koa';
import { enumKeyStrings } from '../../../util';
import Exception, { ExceptionCode } from '../../../util/error';
import { OperationSchema, OperationType } from '../../../util/iam';
import handler from '../../handler';

export const create: KoaRouteHandler<
  { cafeId: string },
  VariablesMap,
  {
    uri: string;
    metadata?: AnyJson;
    state?: CafeImageStateStrings;
  }
> = handler(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { cafeId } = ctx.params;
    const { uri, metadata, state: stateString = 'hidden' } = ctx.request.body;
    const state = CafeImageState[stateString];

    await ctx.state.connection();

    const cafeImages = await getManager()
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

    const created = await getManager()
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

    ctx.status = HTTP_CREATED;
    ctx.body = {
      cafe: {
        id: cafeId,
        image: created?.toJsonObject(),
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
};

export const updateList = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const updateOne: KoaRouteHandler<
  {
    cafeId: string;
    cafeImageId: string;
  },
  VariablesMap,
  {
    uri?: string;
    metadata?: AnyJson | null;
    state?: CafeImageStateStrings;
  }
> = handler(
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

      await checkConsistency(manager, cafeId);

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

export const deleteList = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const deleteOne: KoaRouteHandler<{
  cafeId: string;
  cafeImageId: string;
}> = handler(
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

      await checkConsistency(manager, cafeId);

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
