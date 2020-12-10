import { Middleware, Next, ParameterizedContext } from 'koa';
import { KoaContextState } from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';

const error = (): Middleware<KoaContextState> => async (
  ctx: ParameterizedContext<KoaContextState>,
  next: Next
) => {
  try {
    await next();
  } catch (e) {
    if (Exception.isExceptionOf(e, ExceptionCode.badRequest)) {
      ctx.status = 400;
      ctx.body = { error: e.message };
      return;
    }

    ctx.state.logger.error(e);
    ctx.status = 500;
  }
};

export default error;
