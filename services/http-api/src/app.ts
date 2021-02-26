import 'reflect-metadata';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import cors from '@koa/cors';
import routes from './routes';
import error from './middlewares/error';
import db from './middlewares/db';
import auth from './middlewares/auth';
import logger from './middlewares/logger';

const app = new Koa();

app.use(koaLogger());
app.use(logger());
app.use(cors());
app.use(error());
app.use(db());
app.use(auth());
app.use(bodyParser());
app.use(routes.routes()).use(routes.allowedMethods());

export default app;
