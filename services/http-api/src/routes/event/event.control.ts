import Exception, { ExceptionCode } from '../../util/error';
import handler from '../handler';

export const create = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});
