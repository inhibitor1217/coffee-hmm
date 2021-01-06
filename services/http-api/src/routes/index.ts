import Router from '@koa/router';
import { Context } from 'koa';
import { HTTP_OK } from '../const';
import { KoaContextState } from '../types/koa';
import { buildString } from '../util';
import handler from './handler';

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

export default routes;
