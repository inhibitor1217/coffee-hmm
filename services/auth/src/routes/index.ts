import Router from '@koa/router';
import { HTTP_OK } from '../const';
import { buildString } from '../util';
import handler from './handler';

const routes = new Router();

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
