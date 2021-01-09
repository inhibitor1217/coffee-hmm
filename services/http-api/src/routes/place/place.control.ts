import joi from 'joi';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import { getRepository } from 'typeorm';
import { HTTP_CREATED, HTTP_OK } from '../../const';
import Place from '../../entities/place';
import { KoaRouteHandler, VariablesMap } from '../../types/koa';
import Exception, { ExceptionCode } from '../../util/error';
import { OperationSchema, OperationType } from '../../util/iam';
import handler from '../handler';

export const getList: KoaRouteHandler = handler(async (ctx) => {
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

export const create: KoaRouteHandler<
  VariablesMap,
  VariablesMap,
  { name: string }
> = handler(
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

export const updateOne = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const deleteList = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const deleteOne = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});
