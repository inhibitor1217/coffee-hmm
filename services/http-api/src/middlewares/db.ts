import 'pg';

import { readFile } from 'fs';
import { Middleware, Next, ParameterizedContext } from 'koa';
import path from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { KoaContextState } from '../types/koa';
import entities from '../entities';
import { env } from '../util';
import { createCafeLoader, createCafeWithImagesLoader } from '../entities/cafe';

const createDataLoaders = (ctx: ParameterizedContext<KoaContextState>) => {
  const cafeWithAllImages = createCafeWithImagesLoader(ctx, {
    showHiddenImages: true,
  });
  const cafeWithActiveImages = createCafeWithImagesLoader(ctx, {
    showHiddenImages: false,
  });

  return {
    cafe: createCafeLoader(ctx),
    cafeWithImages: (options: { showHiddenImages: boolean }) =>
      options.showHiddenImages ? cafeWithAllImages : cafeWithActiveImages,
  };
};

export type DataLoaders = ReturnType<typeof createDataLoaders>;

const readOrmConfig = (): Promise<ConnectionOptions> =>
  new Promise<AnyJson>((resolve, reject) => {
    if (process.env.TEST_ORMCONFIG) {
      resolve(JSON.parse(process.env.TEST_ORMCONFIG));
      return;
    }

    readFile(
      path.resolve(process.cwd(), env('ORMCONFIG_FILE')),
      'utf8',
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          const config = JSON.parse(data);
          resolve(config);
        }
      }
    );
  }).then((config) => (config as unknown) as ConnectionOptions);

export const connect = async () =>
  createConnection({
    ...(await readOrmConfig()),
    entities,
  });

const db = (): Middleware<KoaContextState> => {
  let connection: Connection | null = null;

  return async (ctx: ParameterizedContext<KoaContextState>, next: Next) => {
    ctx.state.connection = async (): Promise<Connection> => {
      if (!connection) {
        connection = await connect();
      }
      return connection;
    };

    ctx.state.loaders = createDataLoaders(ctx);

    await next();
  };
};

export default db;
