import Exception, { ExceptionCode } from '../util/error';
import scheduledEventHandler from '../util/scheduler';

export const handler = scheduledEventHandler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});
