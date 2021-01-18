import Router from '@koa/router';
import { Context } from 'koa';
import { KoaContextState } from '../../../types/koa';
import * as cafeImageControl from './cafeImage.control';

const cafeImage = new Router<KoaContextState, Context>();

cafeImage.post('/', cafeImageControl.create);
cafeImage.put('/', cafeImageControl.updateList);
cafeImage.put('/:cafeImageId', cafeImageControl.updateOne);
cafeImage.delete('/', cafeImageControl.deleteList);
cafeImage.delete('/:cafeImageId', cafeImageControl.deleteOne);

export default cafeImage;
