import { Schema } from 'joi';
import { HTTP_INTERNAL_SERVER_ERROR } from '../const';
import {
  KoaRouteHandler,
  KoaRouteHandlerOptions,
  TransformedKoaContext,
  TransformedVariablesMap,
  TransformedKoaRouteHandler,
} from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';
import { OperationSchema } from '../util/iam';

const normalizeRequiredRules = <
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
>(
  ctx: TransformedKoaContext<ParamsT, QueryT, BodyT>,
  rules?:
    | OperationSchema
    | OperationSchema[]
    | ((
        ctx: TransformedKoaContext<ParamsT, QueryT, BodyT>
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

class SchemaValidator<T> {
  raw: unknown;

  schema: Schema | undefined;

  private transformed: T | undefined;

  constructor(raw: unknown, schema?: Schema) {
    this.raw = raw;
    this.schema = schema;
  }

  validate(options?: { errorMessage: string }): SchemaValidator<T> {
    const { error } = this.schema?.validate(this.raw) || {};
    if (error) {
      throw new Exception(ExceptionCode.badRequest, {
        message: options?.errorMessage,
        details: error,
      });
    }
    return this;
  }

  transform(): SchemaValidator<T> {
    this.transformed = this.raw as T;

    return this;
  }

  getVariables(options?: { strict: boolean }): T {
    if (options?.strict) {
      if (!this.transformed) {
        throw new Error(
          'Cannot access getter "variables" prior of calling "transform()"'
        );
      }

      return this.transformed;
    }

    return this.transformed ?? (this.raw as T);
  }
}

const handler = <
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
>(
  routeHandler: TransformedKoaRouteHandler<ParamsT, QueryT, BodyT>,
  options?: KoaRouteHandlerOptions<ParamsT, QueryT, BodyT>
): KoaRouteHandler => async (ctx) => {
  const context: TransformedKoaContext<ParamsT, QueryT, BodyT> = {
    params: new SchemaValidator<ParamsT>(ctx.params, options?.schema?.params)
      .validate({
        errorMessage: 'request params validation failed',
      })
      .transform()
      .getVariables({ strict: true }),
    query: new SchemaValidator<QueryT>(ctx.query, options?.schema?.query)
      .validate({
        errorMessage: 'request query validation failed',
      })
      .transform()
      .getVariables({ strict: true }),
    request: {
      body: new SchemaValidator<BodyT>(ctx.request.body, options?.schema?.body)
        .validate({
          errorMessage: 'request body validation failed',
        })
        .getVariables(),
    },
    state: ctx.state,
  };

  const requiredRules = normalizeRequiredRules<ParamsT, QueryT, BodyT>(
    context,
    options?.requiredRules
  );

  if (
    requiredRules &&
    requiredRules.length > 0 &&
    !ctx.state.policy?.canExecuteOperations(ctx.state, requiredRules)
  ) {
    throw new Exception(ExceptionCode.forbidden, {
      message: 'request context does not have privilege to execute operation',
      requiredOperations: requiredRules.map((rules) => rules.toJsonObject()),
    });
  }

  await routeHandler(context);

  ctx.status = context.status ?? HTTP_INTERNAL_SERVER_ERROR;
  ctx.body = context.body;
};

export default handler;
