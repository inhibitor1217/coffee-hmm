import { ParameterizedContext } from 'koa';
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

export type KoaRouteHandler = (
  ctx: ParameterizedContext<KoaContextState>
) => Promise<void> | void;

export interface KoaRouteHandlerOptions {
  requiredRules?: OperationSchema | OperationSchema[];
}
