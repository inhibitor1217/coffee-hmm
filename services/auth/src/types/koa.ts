import Router from '@koa/router';
import * as Koa from 'koa';
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
  extends Router.RouterParamContext<KoaContextState, Koa.Context> {
  params: ParamsT;
  query: QueryT;
}

interface KoaTypedRequest<BodyT = AnyJson> extends Koa.Request {
  body?: BodyT;
}

export interface KoaContext<
  ParamsT = VariablesMap,
  QueryT = VariablesMap,
  BodyT = AnyJson
> extends Koa.ParameterizedContext<
    KoaContextState,
    RouteParamContext<ParamsT, QueryT>
  > {
  params: ParamsT;
  query: QueryT;
  request: KoaTypedRequest<BodyT>;
}

export type KoaRouteHandler<
  ParamsT = VariablesMap,
  QueryT = VariablesMap,
  BodyT = AnyJson
> = (ctx: KoaContext<ParamsT, QueryT, BodyT>) => Promise<void> | void;

export interface KoaRouteHandlerOptions<
  ParamsT = VariablesMap,
  QueryT = VariablesMap,
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
        ctx: KoaContext<ParamsT, QueryT, BodyT>
      ) => OperationSchema | OperationSchema[]);
}
