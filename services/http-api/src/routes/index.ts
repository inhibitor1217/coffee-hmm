import Router from '@koa/router';
import { Context } from 'koa';
import { HTTP_OK } from '../const';
import { KoaContextState } from '../types/koa';
import { buildString } from '../util';
import cafe from './cafe';
import event from './event';
import handler from './handler';
import place from './place';

const routes = new Router<KoaContextState, Context>();

routes.get(
  '/',
  handler((ctx) => {
    ctx.status = HTTP_OK;
    ctx.body = {
      msg: `${buildString()} is alive!`,
    };
  })
);

routes.use('/cafe', cafe.routes());
routes.use('/event', event.routes());
routes.use('/place', place.routes());

export default routes;
