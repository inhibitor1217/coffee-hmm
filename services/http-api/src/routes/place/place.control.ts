import { getRepository } from 'typeorm';
import { HTTP_OK } from '../../const';
import Place from '../../entities/place';
import { KoaRouteHandler } from '../../types/koa';
import Exception, { ExceptionCode } from '../../util/error';
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

export const create = handler(() => {
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
