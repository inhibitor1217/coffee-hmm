import { KoaRouteHandler, KoaRouteHandlerOptions } from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';
import { OperationSchema } from '../util/iam';

const normalizeRequiredRules = (
  rules?: OperationSchema | OperationSchema[]
) => {
  if (!rules) {
    return null;
  }

  return Array.isArray(rules) ? rules : [rules];
};

const handler = (
  routeHandler: KoaRouteHandler,
  options?: KoaRouteHandlerOptions
): KoaRouteHandler => async (ctx) => {
  const requiredRules = normalizeRequiredRules(options?.requiredRules);

  if (requiredRules && !ctx.state.policy?.canExecuteOperations(requiredRules)) {
    throw new Exception(ExceptionCode.forbidden, {
      message: 'request context does not have privilege to execute operation',
      requiredOperations: requiredRules.map((rules) => rules.toJsonObject()),
    });
  }

  await routeHandler(ctx);
};

export default handler;
