import { Middleware, Next, ParameterizedContext } from 'koa';
import firebaseAdmin from 'firebase-admin';
import { KoaContextState } from '../types/koa';
import { env } from '../util';

const auth = (): Middleware<KoaContextState> => {
  let initialized = false;

  return async (ctx: ParameterizedContext<KoaContextState>, next: Next) => {
    if (!initialized) {
      const firebaseProjectName = `${env('APP_NAME')}-${env('APP_STAGE')}`;
      ctx.state.logger.verbose(
        `Initializing firebase project with project name: ${firebaseProjectName}`
      );

      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault(),
        databaseURL: `https://${firebaseProjectName}.firebaseio.com`,
      });
      ctx.state.logger.debug(`Initialized firebase project.`);

      initialized = true;
    }

    await next();
  };
};

export default auth;
