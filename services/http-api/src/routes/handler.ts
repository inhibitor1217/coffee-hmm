import { OperationSchema, Exception, ExceptionCode } from '@coffee-hmm/common';
import { Schema } from 'joi';
import { HTTP_INTERNAL_SERVER_ERROR } from '../const';
import {
  KoaRouteHandler,
  KoaRouteHandlerOptions,
  TransformedFields,
  TransformedSchemaTypes,
  TransformedKoaContext,
  TransformedVariablesMap,
  TransformedKoaRouteHandler,
} from '../types/koa';

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

const transformField = (
  str: string,
  field: { key: string; type: TransformedSchemaTypes }
): string | number | boolean => {
  const throwParseException = (): never => {
    throw new Exception(ExceptionCode.badRequest, {
      message: `cannot parse value ${str} of key ${field.key}: should be type of ${field.type}`,
    });
  };

  switch (field.type) {
    case TransformedSchemaTypes.boolean: {
      if (str === 'true') {
        return true;
      }

      if (str === 'false') {
        return false;
      }

      throwParseException();
      break;
    }
    case TransformedSchemaTypes.integer: {
      const value = parseInt(str, 10);

      if (Number.isNaN(value)) {
        throwParseException();
      }

      return value;
    }
    case TransformedSchemaTypes.double: {
      const value = parseFloat(str);

      if (Number.isNaN(value)) {
        throwParseException();
      }

      return value;
    }
    default:
      /* unreachable code */
      return str;
  }

  /* unreachable code */
  return str;
};

class SchemaValidator<T> {
  raw: Record<string, unknown>;

  schema: Schema | undefined;

  transformedFields: TransformedFields | undefined;

  private transformed: T | undefined;

  constructor(
    raw: Record<string, unknown>,
    options?: {
      schema?: Schema;
      transform?: TransformedFields;
    }
  ) {
    this.raw = raw;

    this.schema = options?.schema;
    this.transformedFields = options?.transform;
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
    this.transformed = Object.keys(this.raw).reduce((acc, key) => {
      const match = this.transformedFields?.find(
        ({ key: transformedKey }) => transformedKey === key
      );

      return {
        ...acc,
        [key]: match
          ? transformField(this.raw[key] as string, match)
          : this.raw[key],
      };
    }, {} as T);

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

const handler =
  <
    ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
    QueryT extends TransformedVariablesMap = TransformedVariablesMap,
    BodyT = AnyJson
  >(
    routeHandler: TransformedKoaRouteHandler<ParamsT, QueryT, BodyT>,
    options?: KoaRouteHandlerOptions<ParamsT, QueryT, BodyT>
  ): KoaRouteHandler =>
  async (ctx) => {
    const context: TransformedKoaContext<ParamsT, QueryT, BodyT> = {
      params: new SchemaValidator<ParamsT>(ctx.params, {
        schema: options?.schema?.params,
        transform: options?.transform?.params,
      })
        .validate({
          errorMessage: 'request params validation failed',
        })
        .transform()
        .getVariables({ strict: true }),
      query: new SchemaValidator<QueryT>(ctx.query, {
        schema: options?.schema?.query,
        transform: options?.transform?.query,
      })
        .validate({
          errorMessage: 'request query validation failed',
        })
        .transform()
        .getVariables({ strict: true }),
      request: {
        body: new SchemaValidator<BodyT>(ctx.request.body, {
          schema: options?.schema?.body,
        })
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
