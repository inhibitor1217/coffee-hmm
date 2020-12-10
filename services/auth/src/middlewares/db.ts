import { Middleware, Next, ParameterizedContext } from 'koa';
import { Connection, createConnection } from 'typeorm';
import { createUserLoader, createUserProfileLoader } from '../entities/user';
import { AppStage } from '../types/env';
import { KoaContextState } from '../types/koa';
import { appStage } from '../util';

const createDataLoaders = (context: KoaContextState) => ({
  user: createUserLoader(context),
  userProfile: createUserProfileLoader(context),
});

export type DataLoaders = ReturnType<typeof createDataLoaders>;

const db = (): Middleware<KoaContextState> => async (
  ctx: ParameterizedContext<KoaContextState>,
  next: Next
) => {
  let connection: Connection | null = null;
  ctx.state.connection = async (): Promise<Connection> => {
    if (!connection) {
      connection = await createConnection();
    }
    return connection;
  };

  ctx.state.loaders = createDataLoaders(ctx.state);

  await next();

  if (appStage() !== AppStage.local) {
    await (connection as Connection | null)?.close();
  }
};

export default db;
