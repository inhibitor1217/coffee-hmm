import 'pg';

import { readFile } from 'fs';
import { Middleware, Next, ParameterizedContext } from 'koa';
import path from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { createPolicyLoader } from '../entities/policy';
import { createUserLoader, createUserProfileLoader } from '../entities/user';
import { AppStage } from '../types/env';
import { KoaContextState } from '../types/koa';
import { appStage } from '../util';
import entities from '../entities';

const createDataLoaders = (context: KoaContextState) => ({
  user: createUserLoader(context),
  userProfile: createUserProfileLoader(context),
  policy: createPolicyLoader(context),
});

export type DataLoaders = ReturnType<typeof createDataLoaders>;

const readOrmConfig = () =>
  new Promise<ConnectionOptions>((resolve, reject) => {
    readFile(
      path.resolve(process.cwd(), 'ormconfig.json'),
      'utf8',
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          const config = JSON.parse(data);
          resolve((config as unknown) as ConnectionOptions);
        }
      }
    );
  });

const db = (): Middleware<KoaContextState> => {
  let connection: Connection | null = null;

  return async (ctx: ParameterizedContext<KoaContextState>, next: Next) => {
    ctx.state.connection = async (): Promise<Connection> => {
      if (!connection) {
        connection = await createConnection({
          ...(await readOrmConfig()),
          entities,
        });
      }
      return connection;
    };

    ctx.state.loaders = createDataLoaders(ctx.state);

    await next();

    if (appStage() !== AppStage.local) {
      await connection?.close();
    }
  };
};

export default db;
