import ApiService from '../services/api';
import SlackService from '../services/slack';
import type { EventContext } from '../types/event';
import { buildString } from '../util';
import sqsEventHandler from '../util/handler/sqsEventHandler';

function formatCreateCafeSlackMessage({
  cafeId,
  cafeName,
  placeName,
}: {
  cafeId: string;
  cafeName: string;
  placeName: string;
}): AnyJson {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '<!here>',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${placeName}* 지역에 카페 *${cafeName}* (이)가 추가되었습니다! :coffee:`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '새로운 카페를 만나볼까요?',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '카페 보러 가기 :runner:',
            emoji: true,
          },
          url: `https://coffeehmm.com/cafe/${cafeId}`,
          action_id: 'go-to-new-cafe',
        },
      },
    ],
  };
}

interface CreateCafeMessage {
  entityName: 'cafe';
  entityId: string;
  publishSource: string;
  actorType: 'user';
  actorId: string | null;
}

async function cafeCreateSlackNotification(
  { logger }: EventContext,
  name: string,
  content: AnyJson
): Promise<[number, AnyJson]> {
  const {
    entityName,
    entityId: cafeId,
    actorId: userId,
  } = (content as unknown) as CreateCafeMessage;

  if (name !== 'create' || entityName !== 'cafe') {
    logger?.warning(
      `Given a message with name: ${name}, entityName: ${entityName}.`
    );
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject([422, 'Requires a cafe creation message']);
  }

  logger?.info(
    [
      `Create slack notification for cafe creation`,
      `cafe.id: ${cafeId}`,
      `user.id: ${userId ?? 'null'}`,
    ].join('\n')
  );

  const cafe = await ApiService.getCafe(cafeId);

  await SlackService.send(
    formatCreateCafeSlackMessage({
      cafeId: cafe.id,
      cafeName: cafe.name,
      placeName: cafe.place.name,
    })
  );

  return Promise.resolve([200, null]);
}

export const handler = sqsEventHandler(cafeCreateSlackNotification, {
  name: 'cafeCreateSlackNotification',
  buildString: buildString(),
});
