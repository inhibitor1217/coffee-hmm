import Router from '@koa/router';
import { Context, ParameterizedContext } from 'koa';
import { Schema } from 'joi';
import { Connection } from 'typeorm';
import { DataLoaders } from '../middlewares/db';
import { IamPolicy, OperationSchema } from '../util/iam';
import Logger from '../util/logger';

export interface KoaContextState {
  logger: Logger;
  connection(): Promise<Connection>;
  loaders: DataLoaders;
  uid?: string;
  policy?: IamPolicy;
}

export type VariablesMap = { [key: string]: string | number | boolean };

interface RouteParamContext<ParamsT = VariablesMap, QueryT = VariablesMap>
  extends Router.RouterParamContext<KoaContextState, Context> {
  params: ParamsT;
  query: QueryT;
}

export type KoaContext<
  ParamsT = VariablesMap,
  QueryT = VariablesMap
> = ParameterizedContext<
  KoaContextState,
  Context & RouteParamContext<ParamsT, QueryT>
>;

export type KoaRouteHandler<ParamsT = VariablesMap, QueryT = VariablesMap> = (
  ctx: KoaContext<ParamsT, QueryT>
) => Promise<void> | void;

export interface KoaRouteHandlerOptions<
  ParamsT = VariablesMap,
  QueryT = VariablesMap
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
        ctx: KoaContext<ParamsT, QueryT>
      ) => OperationSchema | OperationSchema[]);
}
