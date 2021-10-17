import type { EventContext } from '../types/event';
import { buildString } from '../util';
import sqsEventHandler from '../util/handler/sqsEventHandler';

function cafeCreateSlackNotification(
  context: EventContext,
  name: string,
  content: AnyJson
): Promise<[number, AnyJson]> {
  return Promise.resolve([501, 'not implemeted']);
}

export const handler = sqsEventHandler(cafeCreateSlackNotification, {
  name: 'cafeCreateSlackNotification',
  buildString: buildString(),
});
