import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import cors from '@koa/cors';
import routes from './routes';
import logger from './middlewares/logger';
import error from './middlewares/error';

const app = new Koa();

app.use(koaLogger());
app.use(logger());
app.use(cors());
app.use(error());
app.use(bodyParser());
app.use(routes.routes()).use(routes.allowedMethods());

export default app;
