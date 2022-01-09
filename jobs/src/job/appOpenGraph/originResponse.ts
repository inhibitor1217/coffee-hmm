import axios from 'axios';
import type { CloudFrontResponseEvent } from 'aws-lambda';
import type { CafeRecord } from '../../services/api';
import { cloudfrontResponseEventHandler } from '../../util/handler/cloudfrontEventHandler';
import { CAFE_DETAIL_PAGE_URL_REGEX } from './const';

const constructHtml = (uri: string, cafe: CafeRecord): string => {
  const title = cafe.name;
  const imageRelativeUri =
    cafe.image.list.find((cafeImage) => cafeImage.isMain)?.relativeUri ?? '';
  const imageUri = `${imageRelativeUri
    .replace(/(http:\/\/|https:\/\/)/g, '')
    .split('/')
    .map((r, i) => (i > 0 ? r : 'https://resource.coffeehmm.com'))
    .join('/')}?d=720x720`;

  return `<html>
  <head>
    <meta property="og:url" content="https://coffeehmm.com${uri}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="커피 흠: 친구와, 연인과, 혼자 갈 만한 카페를 찾고있다면? 연남동 성수동 한남동 유명한 카페거리의 예쁜 카페를 카페 추천앱, 커피흠에서 바로 찾아보세요!"/>
    <meta property="og:image" content="${imageUri}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="720" />
    <meta property="og:image:height" content="720" />
    <title>${title}</title>
  </head>
</html>`;
};

export const originResponse = async (event: CloudFrontResponseEvent) => {
  const {
    Records: [
      {
        cf: { request, response },
      },
    ],
  } = event;
  const { headers, uri } = request;

  if (headers['is-crawler'] && headers['is-crawler'][0].value === 'true') {
    const [, cafeId] = CAFE_DETAIL_PAGE_URL_REGEX.exec(uri) ?? [];
    if (cafeId) {
      const api = axios.create({
        baseURL: 'https://release.api.coffee-hmm.inhibitor.io',
      });
      const cafe = await api
        .get<{ cafe: CafeRecord }>(`/cafe/${cafeId}`)
        .then((res) => res.data.cafe);

      response.status = '200';

      response.headers['content-type'] = [
        {
          key: 'Content-Type',
          value: 'text/html',
        },
      ];

      response.headers['cache-control'] = [
        {
          key: 'cache-control',
          value: 'no-cache, no-store, must-revalidate',
        },
      ];

      return {
        result: {
          ...response,
          body: constructHtml(uri, cafe),
        },
        body: null,
      };
    }
  }

  return {
    result: response,
    body: null,
  };
};

export const handler = cloudfrontResponseEventHandler(
  ({ event }) => originResponse(event),
  {
    name: 'appOpenGraph/originResponse',
  }
);
