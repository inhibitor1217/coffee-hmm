import { Middleware, Next, ParameterizedContext } from 'koa';
import { KoaContextState } from '../types/koa';
import { logLevel } from '../util';
import Logger from '../util/logger';

const logger =
  (): Middleware<KoaContextState> =>
  async (ctx: ParameterizedContext<KoaContextState>, next: Next) => {
    ctx.state.logger = new Logger(logLevel());
    await next();
  };

export default logger;
