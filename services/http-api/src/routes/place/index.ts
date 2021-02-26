import Router from '@koa/router';
import { Context } from 'koa';
import { KoaContextState } from '../../types/koa';
import * as placeControl from './place.control';

const place = new Router<KoaContextState, Context>();

place.get('/list', placeControl.getList);
place.post('/', placeControl.create);
place.put('/:placeId', placeControl.updateOne);
place.delete('/', placeControl.deleteList);
place.delete('/:placeId', placeControl.deleteOne);

export default place;
