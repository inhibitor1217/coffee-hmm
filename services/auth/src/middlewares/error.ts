import { Middleware, Next, ParameterizedContext } from 'koa';
import { KoaContextState } from '../types/koa';

const error = (): Middleware<KoaContextState> => async (
  ctx: ParameterizedContext<KoaContextState>,
  next: Next
) => {
  try {
    await next();
  } catch (e) {
    ctx.state.logger.error(e);
    ctx.status = 500;
  }
};

export default error;
