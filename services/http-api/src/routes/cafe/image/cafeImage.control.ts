import joi from 'joi';
import { FOREIGN_KEY_VIOLATION } from 'pg-error-constants';
import { getManager } from 'typeorm';
import { HTTP_CREATED } from '../../../const';
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

export const updateList = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const updateOne = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const deleteList = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const deleteOne = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});
