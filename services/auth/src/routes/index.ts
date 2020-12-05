import Router from '@koa/router';
import { ParameterizedContext } from 'koa';
import { HTTP_OK } from '../const';
import { KoaContextState } from '../types/koa';
import { buildString } from '../util';

const routes = new Router();

routes.get('/', (ctx: ParameterizedContext<KoaContextState>) => {
  ctx.status = HTTP_OK;
  ctx.body = {
    msg: `${buildString()} is alive!`,
  };
});

export default routes;
