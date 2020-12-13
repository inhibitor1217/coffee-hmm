import { Middleware, Next, ParameterizedContext } from 'koa';
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_UNAUTHORIZED,
} from '../const';
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
      ctx.status = HTTP_BAD_REQUEST;
      ctx.body = { error: e.payload };
      return;
    }

    if (Exception.isExceptionOf(e, ExceptionCode.unauthorized)) {
      ctx.status = HTTP_UNAUTHORIZED;
      ctx.body = { error: e.payload };
      return;
    }

    if (Exception.isExceptionOf(e, ExceptionCode.forbidden)) {
      ctx.status = HTTP_FORBIDDEN;
      ctx.body = { error: e.payload };
      return;
    }

    ctx.state.logger.error(e);
    ctx.status = HTTP_INTERNAL_SERVER_ERROR;
  }
};

export default error;
