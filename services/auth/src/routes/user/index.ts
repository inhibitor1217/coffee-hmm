import Router from '@koa/router';
import { Context } from 'koa';
import { KoaContextState } from '../../types/koa';
import * as userControl from './user.control';

const user = new Router<KoaContextState, Context>();

user.get('/count', userControl.getUserCount);
user.get('/list', userControl.getUserList);
user.get('/:userId', userControl.getSingleUser);
user.put('/:userId/state', userControl.putUserState);
user.get('/:userId/profile', userControl.getUserProfile);
user.put('/:userId/profile', userControl.putUserProfile);
user.get('/:userId/policy', userControl.getUserPolicy);

export default user;
