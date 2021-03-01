import * as Koa from 'koa';
import { Schema } from 'joi';
import { Connection } from 'typeorm';
import app from '../app';
import { IamPolicy, OperationSchema } from '../util/iam';
import Logger from '../util/logger';
import { DataLoaders } from '../middlewares/db';

export interface KoaContextState {
  logger: Logger;
  connection(): Promise<Connection>;
  loaders: DataLoaders;
  uid?: string;
  policy?: IamPolicy;
}

export type VariablesMap = { [key: string]: string };

type TransformedVariable = string | number | boolean;
export type TransformedVariablesMap = {
  [key: string]: TransformedVariable | TransformedVariable[] | undefined | null;
};

export type TransformedKoaContext<
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
> = {
  params: ParamsT;
  query: QueryT;
  request: {
    body?: BodyT;
  };
  state: KoaContextState;
  status?: number;
  body?: AnyJson;
};

export type KoaRouteHandler = (
  ctx: Koa.ParameterizedContext<KoaContextState>
) => Promise<void> | void;

export type TransformedKoaRouteHandler<
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
> = (
  ctx: TransformedKoaContext<ParamsT, QueryT, BodyT>
) => Promise<void> | void;

export interface KoaRouteHandlerOptions<
  ParamsT extends TransformedVariablesMap = TransformedVariablesMap,
  QueryT extends TransformedVariablesMap = TransformedVariablesMap,
  BodyT = AnyJson
> {
  schema?: {
    params?: Schema;
    query?: Schema;
    body?: Schema;
  };
  requiredRules?:
    | OperationSchema
    | OperationSchema[]
    | ((
        ctx: TransformedKoaContext<ParamsT, QueryT, BodyT>
      ) => OperationSchema | OperationSchema[]);
}

export type KoaServer = ReturnType<typeof app.listen>;
