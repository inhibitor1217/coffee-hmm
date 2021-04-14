export type KoaContextState = any;

export type VariablesMap = any;

type TransformedVariable = any;
export type TransformedVariablesMap = any

export enum TransformedSchemaTypes {
  integer = 'integer',
  double = 'double',
  boolean = 'boolean',
}

export type TransformedFields = any;

export type TransformedKoaContext<
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
> = any;

export type KoaRouteHandler = any

export type TransformedKoaRouteHandler<
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
> = any;

export type KoaRouteHandlerOptions<
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
> = any;

export type KoaServer = any;
