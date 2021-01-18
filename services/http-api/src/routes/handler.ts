import {
  KoaContext,
  KoaRouteHandler,
  KoaRouteHandlerOptions,
  VariablesMap,
} from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';
import { OperationSchema } from '../util/iam';

const normalizeRequiredRules = <
  ParamsT extends VariablesMap = VariablesMap,
  QueryT = VariablesMap,
  BodyT = AnyJson
>(
  ctx: KoaContext<ParamsT, QueryT, BodyT>,
  rules?:
    | OperationSchema
    | OperationSchema[]
    | ((
        ctx: KoaContext<ParamsT, QueryT, BodyT>
      ) => OperationSchema | OperationSchema[])
) => {
  if (!rules) {
    return null;
  }

  if (typeof rules === 'function') {
    const derivedRules = rules(ctx);
    return Array.isArray(derivedRules) ? derivedRules : [derivedRules];
  }

  return Array.isArray(rules) ? rules : [rules];
};

const handler = <
  ParamsT extends VariablesMap = VariablesMap,
  QueryT = VariablesMap,
  BodyT = AnyJson
>(
  routeHandler: KoaRouteHandler<ParamsT, QueryT, BodyT>,
  options?: KoaRouteHandlerOptions<ParamsT, QueryT, BodyT>
): KoaRouteHandler<Record<string, string>, QueryT, BodyT> => async (ctx) => {
  if (options?.schema?.params) {
    const validation = options.schema.params.validate(ctx.params);
    if (validation.error) {
      throw new Exception(ExceptionCode.badRequest, {
        message: 'request params validation failed',
        details: validation.error,
      });
    }
  }

  if (options?.schema?.query) {
    const validation = options.schema.query.validate(ctx.query);
    if (validation.error) {
      throw new Exception(ExceptionCode.badRequest, {
        message: 'request query validation failed',
        details: validation.error,
      });
    }
  }

  if (options?.schema?.body) {
    const validation = options.schema.body.validate(ctx.request.body);
    if (validation.error) {
      throw new Exception(ExceptionCode.badRequest, {
        message: 'request body validation failed',
        details: validation.error,
      });
    }
  }

  const requiredRules = normalizeRequiredRules<ParamsT, QueryT, BodyT>(
    ctx as KoaContext<ParamsT, QueryT, BodyT>,
    options?.requiredRules
  );

  if (
    requiredRules &&
    requiredRules.length > 0 &&
    !ctx.state.policy?.canExecuteOperations(ctx, requiredRules)
  ) {
    throw new Exception(ExceptionCode.forbidden, {
      message: 'request context does not have privilege to execute operation',
      requiredOperations: requiredRules.map((rules) => rules.toJsonObject()),
    });
  }

  await routeHandler(ctx as KoaContext<ParamsT, QueryT, BodyT>);
};

export default handler;
