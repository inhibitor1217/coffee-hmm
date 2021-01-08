import Router from '@koa/router';
import { Context } from 'koa';
import { KoaContextState } from '../../types/koa';
import * as cafeControl from './cafe.control';
import cafeImage from './image';

const cafe = new Router<KoaContextState, Context>();

cafe.get('/feed', cafeControl.getFeed);
cafe.get('/count', cafeControl.getCount);
cafe.get('/list', cafeControl.getList);
cafe.get('/:cafeId', cafeControl.getOne);
cafe.post('/', cafeControl.create);
cafe.put('/:cafeId', cafeControl.updateOne);

cafe.use('/:cafeId/image', cafeImage.routes());

export default cafe;
