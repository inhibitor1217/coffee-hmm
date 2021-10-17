import { buildString } from '../util';
import sqsEventHandler from '../util/handler/sqsEventHandler';

export const handler = sqsEventHandler({
  name: 'cafeCreateSlackNotification',
  buildString: buildString(),
});
