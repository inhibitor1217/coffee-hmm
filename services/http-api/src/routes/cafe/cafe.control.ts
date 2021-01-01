import Exception, { ExceptionCode } from '../../util/error';
import handler from '../handler';

export const getOne = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const getFeed = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const getCount = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const getList = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const create = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});

export const updateOne = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});
