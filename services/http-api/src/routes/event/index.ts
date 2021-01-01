import Router from '@koa/router';
import { Context } from 'koa';
import { KoaContextState } from '../../types/koa';
import * as eventControl from './event.control';

const event = new Router<KoaContextState, Context>();

event.post('/', eventControl.create);

export default event;
