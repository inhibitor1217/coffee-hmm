import Router from '@koa/router';
import { Context } from 'koa';
import { HTTP_OK } from '../const';
import { KoaContextState } from '../types/koa';
import { buildString } from '../util';
import * as authControl from './auth.control';
import handler from './handler';
import user from './user';

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
