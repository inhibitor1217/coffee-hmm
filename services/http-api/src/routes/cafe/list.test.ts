import {
  CafeState,
  CafeStateStrings,
  CafeImageState,
  CafeImageStateStrings,
  IamPolicy,
  IamRule,
  OperationType,
} from '@coffee-hmm/common';
import pLimit from 'p-limit';
import { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import { HTTP_BAD_REQUEST, HTTP_OK } from '../../const';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../../test';
import { setupCafe, setupPlace } from '../../test/util';
import { KoaServer } from '../../types/koa';
import { env } from '../../util';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

let cafeIds: string[];
let activeCafeIds: string[];
let activeCafeNames: string[];
let placeIds: string[];
let numCafesInPankyo: number;
let numCafesInYeonnam: number;

jest.setTimeout(30000);
// eslint-disable-next-line no-console
console.log = jest.fn();

const adminerPolicyString = JSON.stringify(
  new IamPolicy({
    rules: [
      new IamRule({
        operationType: OperationType.query,
        operation: 'api.cafe.hidden',
      }),
      new IamRule({
        operationType: OperationType.query,
        operation: 'api.cafe.image.hidden',
      }),
      new IamRule({
        operationType: OperationType.mutation,
        operation: 'api.cafe',
      }),
    ],
  }).toJsonObject()
);

const NUM_TEST_CAFES = 200;
const NUM_PLACES = 7;
const PLACE_NAMES = [
  '판교',
  '연남동',
  '신도림',
  '강남',
  '성수',
  '서울대입구',
  '건대',
];

const setupCafes = async (
  generateImages?: (
    index: number
  ) => { uri: string; state: CafeImageState; metadata?: AnyJson }[]
) => {
  const places = await Promise.all(
    PLACE_NAMES.map((name) => setupPlace(connection, { name }))
  );

  const range = [...Array(NUM_TEST_CAFES).keys()];

  const throttle = pLimit(16);
  const ids = await Promise.all(
    range
      .map(
        (i) => () =>
          setupCafe(connection, {
            name: `카페_${i.toString().padStart(3, '0')}`,
            placeId: places[i % NUM_PLACES].id,
            state: i % 2 === 0 ? CafeState.active : CafeState.hidden,
            images: generateImages && generateImages(i),
          }).then(({ cafe }) => cafe.id)
      )
      .map((task) => throttle(task))
  );

  const activeIds = ids.filter((_, i) => i % 2 === 0);
  const names = range.map((i) => `카페_${i.toString().padStart(3, '0')}`);
  const activeNames = names.filter((_, i) => i % 2 === 0);

  return {
    cafeIds: ids,
    activeCafeIds: activeIds,
    cafeNames: names,
    activeCafeNames: activeNames,
    placeIds: places.map((place) => place.id),
    numActiveCafesWithPlaceOne: range
      .filter((index) => index % 2 === 0)
      .filter((index) => index % NUM_PLACES === 0).length,
    numActiveCafesWithPlaceTwo: range
      .filter((index) => index % 2 === 0)
      .filter((index) => index % NUM_PLACES === 1).length,
  };
};

type SimpleCafe = {
  id: string;
  updatedAt: string;
  name: string;
  place: {
    id: string;
    name: string;
  };
  state: CafeStateStrings;
  image: {
    count: number;
    list: {
      id: string;
      index: number;
      state: CafeImageStateStrings;
      relativeUri: string;
    }[];
  };
};

const sweepCafes = async (
  uri: string,
  query: Record<string, number | string | boolean>,
  admin?: boolean
) => {
  async function recursiveSweep(
    cafes: SimpleCafe[],
    { cursor, identifier }: { cursor?: string; identifier?: string }
  ): Promise<SimpleCafe[]> {
    const response = admin
      ? await request
          .get(uri)
          .set({
            'x-debug-user-id': uuid.v4(),
            'x-debug-iam-policy': adminerPolicyString,
          })
          .query({ limit: 10, ...query, cursor, identifier })
          .expect(HTTP_OK)
      : await request
          .get(uri)
          .query({ limit: 10, ...query, cursor, identifier })
          .expect(HTTP_OK);

    const {
      cafe: { list },
      cursor: nextCursor,
      identifier: nextIdentifier,
    } = response.body as {
      cafe: { list: SimpleCafe[] };
      cursor: string;
      identifier?: string;
    };

    expect(list.length).toBeLessThanOrEqual((query.limit as number) ?? 10);

    const merged = [...cafes, ...list];

    if (!nextCursor) {
      return merged;
    }

    return recursiveSweep(merged, {
      cursor: nextCursor,
      identifier: nextIdentifier,
    });
  }

  return recursiveSweep([], {});
};

beforeAll(async () => {
  connection = await createConnection(
    ormConfigs.worker(parseInt(env('JEST_WORKER_ID'), 10))
  );

  const { server: _server, request: _request } = openServer();
  server = _server;
  request = _request;

  await cleanDatabase(connection);

  const {
    cafeIds: _cafeIds,
    activeCafeIds: _activeCafeIds,
    activeCafeNames: _activeCafeNames,
    placeIds: _placeIds,
    numActiveCafesWithPlaceOne,
    numActiveCafesWithPlaceTwo,
  } = await setupCafes((i) =>
    [...Array(i % 5).keys()].map((j) => ({
      uri: `/image/${i}/${j}`,
      state: j % 2 === 0 ? CafeImageState.active : CafeImageState.hidden,
    }))
  );

  cafeIds = _cafeIds;
  activeCafeIds = _activeCafeIds;
  activeCafeNames = _activeCafeNames;
  placeIds = _placeIds;
  numCafesInPankyo = numActiveCafesWithPlaceOne;
  numCafesInYeonnam = numActiveCafesWithPlaceTwo;
});

afterAll(async () => {
  await connection?.close();
  await closeServer(server);
});

describe('Cafe - GET /cafe/feed', () => {
  test('Retrieves a list of cafes', async () => {
    const response = await request
      .get('/cafe/feed')
      .query({ limit: 20 })
      .expect(HTTP_OK);

    const {
      cafe: { list },
      cursor,
      identifier,
    } = response.body as {
      cafe: { list: SimpleCafe[] };
      cursor: string;
      identifier: string;
    };

    expect(list.length).toBeLessThanOrEqual(20);
    expect(cursor).toBeTruthy();
    expect(identifier).toBeTruthy();

    list.forEach((item) => {
      expect(activeCafeIds).toContain(item.id);
      expect(activeCafeNames).toContain(item.name);
      expect(PLACE_NAMES).toContain(item.place.name);
      expect(item.state).toBe('active');
    });
  });

  test('Can list all active cafes using cursor', async () => {
    const cafes = await sweepCafes('/cafe/feed', {});

    expect(cafes.length).toBe(activeCafeIds.length);
    cafes.forEach((item) => {
      expect(activeCafeIds).toContain(item.id);
      expect(activeCafeNames).toContain(item.name);
      expect(PLACE_NAMES).toContain(item.place.name);
      expect(item.state).toBe('active');
    });
  });

  test('A list should be different per user id, or an unsigned user', async () => {
    const uid0 = uuid.v4();
    const responses = await Promise.all(
      [uid0, uid0, uuid.v4(), null, null].map((uid) =>
        request
          .get('/cafe/feed')
          .query({ limit: 20 })
          .set(
            uid
              ? {
                  'x-debug-user-id': uid,
                  'x-debug-iam-policy': adminerPolicyString,
                }
              : {}
          )
          .expect(HTTP_OK)
      )
    );

    const cafeIdLists = responses
      .map(
        (response) =>
          response.body as {
            cafe: { list: SimpleCafe[] };
            cursor: string;
            identifier: string;
          }
      )
      .map((body) => body.cafe.list.map((cafe) => cafe.id));

    expect(cafeIdLists[0]).toEqual(cafeIdLists[1]);
    expect(cafeIdLists[1]).not.toEqual(cafeIdLists[2]);
    expect(cafeIdLists[2]).not.toEqual(cafeIdLists[3]);
    expect(cafeIdLists[3]).not.toEqual(cafeIdLists[4]);
  });

  test('A list should be different per user id, or an unsigned user (place=mixed case)', async () => {
    const uid0 = uuid.v4();
    const responses = await Promise.all(
      [uid0, uid0, uuid.v4(), null, null].map((uid) =>
        request
          .get('/cafe/feed')
          .query({ limit: 10, place: 'mixed' })
          .set(
            uid
              ? {
                  'x-debug-user-id': uid,
                  'x-debug-iam-policy': adminerPolicyString,
                }
              : {}
          )
          .expect(HTTP_OK)
      )
    );

    const cafeIdLists = responses
      .map(
        (response) =>
          response.body as {
            cafe: { list: SimpleCafe[] };
            cursor: string;
            identifier: string;
          }
      )
      .map((body) => body.cafe.list.map((cafe) => cafe.id));

    expect(cafeIdLists[0]).toEqual(cafeIdLists[1]);
    expect(cafeIdLists[1]).not.toEqual(cafeIdLists[2]);
    expect(cafeIdLists[2]).not.toEqual(cafeIdLists[3]);
    expect(cafeIdLists[3]).not.toEqual(cafeIdLists[4]);
  });

  test('A list should be different in next day', async () => {
    const uid = uuid.v4();

    Date.now = jest.fn(() => new Date(Date.UTC(2021, 1, 1)).valueOf());

    const todayCafeIds = (
      (
        await request
          .get('/cafe/feed')
          .query({ limit: 10 })
          .set({
            'x-debug-user-id': uid,
            'x-debug-iam-policy': adminerPolicyString,
          })
          .expect(HTTP_OK)
      ).body as {
        cafe: { list: SimpleCafe[] };
        cursor: string;
        identifier: string;
      }
    ).cafe.list.map((cafe) => cafe.id);

    Date.now = jest.fn(() => new Date(Date.UTC(2021, 1, 2)).valueOf());

    const tomorrowCafeIds = (
      (
        await request
          .get('/cafe/feed')
          .query({ limit: 10 })
          .set({
            'x-debug-user-id': uid,
            'x-debug-iam-policy': adminerPolicyString,
          })
          .expect(HTTP_OK)
      ).body as {
        cafe: { list: SimpleCafe[] };
        cursor: string;
        identifier: string;
      }
    ).cafe.list.map((cafe) => cafe.id);

    expect(todayCafeIds).not.toEqual(tomorrowCafeIds);
  });

  test('A list should be different in next day (place=mixed case)', async () => {
    const uid = uuid.v4();

    Date.now = jest.fn(() => new Date(Date.UTC(2021, 1, 1)).valueOf());

    const todayCafeIds = (
      (
        await request
          .get('/cafe/feed')
          .query({ limit: 10, place: 'mixed' })
          .set({
            'x-debug-user-id': uid,
            'x-debug-iam-policy': adminerPolicyString,
          })
          .expect(HTTP_OK)
      ).body as {
        cafe: { list: SimpleCafe[] };
        cursor: string;
        identifier: string;
      }
    ).cafe.list.map((cafe) => cafe.id);

    Date.now = jest.fn(() => new Date(Date.UTC(2021, 1, 2)).valueOf());

    const tomorrowCafeIds = (
      (
        await request
          .get('/cafe/feed')
          .query({ limit: 10, place: 'mixed' })
          .set({
            'x-debug-user-id': uid,
            'x-debug-iam-policy': adminerPolicyString,
          })
          .expect(HTTP_OK)
      ).body as {
        cafe: { list: SimpleCafe[] };
        cursor: string;
        identifier: string;
      }
    ).cafe.list.map((cafe) => cafe.id);

    expect(todayCafeIds).not.toEqual(tomorrowCafeIds);
  });

  test('Cafe item contains its images', async () => {
    const response = await request
      .get('/cafe/feed')
      .query({ limit: 10 })
      .expect(HTTP_OK);

    const {
      cafe: { list: cafeList },
    } = response.body as { cafe: { list: SimpleCafe[] } };

    cafeList.forEach((cafe) => {
      const {
        id,
        image: { count, list: imageList },
      } = cafe;

      const index = cafeIds.findIndex((item) => id === item);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(NUM_TEST_CAFES);

      expect(count).toBe(Math.ceil((index % 5) * 0.5));
      expect(imageList.length).toBe(count);
      imageList.forEach((image, imageIndex) => {
        expect(image.index).toBe(imageIndex);
        expect(image.state).toBe('active');
        expect(image.relativeUri).toBe(`/image/${index}/${2 * image.index}`);
      });
    });
  });

  test('Can filter cafes with place id', async () => {
    const {
      cafe: { list: nonEmptyList },
    } = (
      await request
        .get('/cafe/feed')
        .query({ limit: 10, placeId: placeIds[0] })
        .expect(HTTP_OK)
    ).body as { cafe: { list: SimpleCafe[] } };

    expect(nonEmptyList.length).toBeGreaterThan(1);

    const {
      cafe: { list: emptyList },
    } = (
      await request
        .get('/cafe/feed')
        .query({ limit: 10, placeId: uuid.v4() })
        .expect(HTTP_OK)
    ).body as { cafe: { list: SimpleCafe[] } };

    expect(emptyList.length).toBe(0);
  });

  test('Can filter cafes with place name', async () => {
    const {
      cafe: { list: nonEmptyList },
    } = (
      await request
        .get('/cafe/feed')
        .query({ limit: 10, placeName: '판교' })
        .expect(HTTP_OK)
    ).body as { cafe: { list: SimpleCafe[] } };

    expect(nonEmptyList.length).toBeGreaterThan(1);

    const {
      cafe: { list: emptyList },
    } = (
      await request
        .get('/cafe/feed')
        .query({ limit: 10, placeName: '성수동' })
        .expect(HTTP_OK)
    ).body as { cafe: { list: SimpleCafe[] } };

    expect(emptyList.length).toBe(0);
  });

  test('If place=mixed, the response contains cafes with unique place', async () => {
    const cafes = await sweepCafes('/cafe/feed', { place: 'mixed' });

    const placeIdList = cafes.map((cafe) => cafe.place.id);
    const placeIdSet = new Set(placeIds);

    expect(placeIdList.length).toBe(placeIdSet.size);
  });

  test('If place=mixed, the response should sweep all places', async () => {
    const cafes = await sweepCafes('/cafe/feed', { place: 'mixed' });

    const placeNames = cafes.map((cafe) => cafe.place.name);

    expect(placeNames.sort()).toEqual([...PLACE_NAMES].sort());
  });

  test('Cannot use both placeId and placeName parameters', async () => {
    await request
      .get('/cafe/feed')
      .query({ limit: 10, placeId: uuid.v4(), placeName: 'name' })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Cannot use both place and placeId parameters', async () => {
    await request
      .get('/cafe/feed')
      .query({ limit: 10, place: 'mixed', placeId: uuid.v4() })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Cannot use both place and placeName parameters', async () => {
    await request
      .get('/cafe/feed')
      .query({ limit: 10, place: 'mixed', placeName: 'foo' })
      .expect(HTTP_BAD_REQUEST);
  });
});

describe('Cafe - GET /cafe/count', () => {
  test('Can retrieve number of cafes', async () => {
    const response = await request.get('/cafe/count').expect(HTTP_OK);

    const {
      cafe: { count },
    } = response.body as { cafe: { count: number } };

    expect(count).toBe(activeCafeIds.length);
  });

  test('Can retrieve number of cafes including hidden ones', async () => {
    const response = await request
      .get('/cafe/count')
      .query({ showHidden: true })
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .expect(HTTP_OK);

    const {
      cafe: { count },
    } = response.body as { cafe: { count: number } };

    expect(count).toBe(NUM_TEST_CAFES);
  });

  test('Can interpret query parameter: showHidden=false as it is', async () => {
    const response = await request
      .get('/cafe/count')
      .query({ showHidden: false })
      .expect(HTTP_OK);

    const {
      cafe: { count },
    } = response.body as { cafe: { count: number } };

    expect(count).toBe(activeCafeIds.length);
  });

  test('Can retrieve number of cafes using place as keyword', async () => {
    const responsePankyo = await request
      .get('/cafe/count')
      .query({ keyword: '판교' })
      .expect(HTTP_OK);

    const {
      cafe: { count: countPankyo },
    } = responsePankyo.body as { cafe: { count: number } };

    expect(countPankyo).toBe(numCafesInPankyo);

    const responseSuwon = await request
      .get('/cafe/count')
      .query({ keyword: '수원' })
      .expect(HTTP_OK);

    const {
      cafe: { count: countGangnam },
    } = responseSuwon.body as { cafe: { count: number } };

    expect(countGangnam).toBe(0);
  });

  test('Can retrieve number of cafes using place id', async () => {
    const responsePankyo = await request
      .get('/cafe/count')
      .query({ placeId: placeIds[0] })
      .expect(HTTP_OK);

    const {
      cafe: { count: countPankyo },
    } = responsePankyo.body as { cafe: { count: number } };

    expect(countPankyo).toBe(numCafesInPankyo);

    const responseYeonnam = await request
      .get('/cafe/count')
      .query({ placeId: placeIds[1] })
      .expect(HTTP_OK);

    const {
      cafe: { count: countYeonnam },
    } = responseYeonnam.body as { cafe: { count: number } };

    expect(countYeonnam).toBe(numCafesInYeonnam);

    const responseInvalid = await request
      .get('/cafe/count')
      .query({ placeId: uuid.v4() })
      .expect(HTTP_OK);

    const {
      cafe: { count: countInvalid },
    } = responseInvalid.body as { cafe: { count: number } };

    expect(countInvalid).toBe(0);
  });

  test('Can retrieve number of cafes using place name', async () => {
    const responsePankyo = await request
      .get('/cafe/count')
      .query({ placeName: '판교' })
      .expect(HTTP_OK);

    const {
      cafe: { count: countPankyo },
    } = responsePankyo.body as { cafe: { count: number } };

    expect(countPankyo).toBe(numCafesInPankyo);

    const responseYeonnam = await request
      .get('/cafe/count')
      .query({ placeName: '연남동' })
      .expect(HTTP_OK);

    const {
      cafe: { count: countYeonnam },
    } = responseYeonnam.body as { cafe: { count: number } };

    expect(countYeonnam).toBe(numCafesInYeonnam);

    const responseJamsil = await request
      .get('/cafe/count')
      .query({ placeName: '잠실' })
      .expect(HTTP_OK);

    const {
      cafe: { count: countJamsil },
    } = responseJamsil.body as { cafe: { count: number } };

    expect(countJamsil).toBe(0);
  });

  test('Partial place name does not count cafes', async () => {
    const responseYeonnamPartial = await request
      .get('/cafe/count')
      .query({ placeName: '연남' })
      .expect(HTTP_OK);

    const {
      cafe: { count: countYeonnamPartial },
    } = responseYeonnamPartial.body as { cafe: { count: number } };

    expect(countYeonnamPartial).toBe(0);
  });

  test('Cannot use place id and place name together', async () => {
    await request
      .get('/cafe/count')
      .query({ placeId: placeIds[0], placeName: '판교' })
      .expect(HTTP_BAD_REQUEST);
  });
});

describe('Cafe - GET /cafe/list', () => {
  test('Can list all cafes: order by updatedAt descending', async () => {
    const cafes = await sweepCafes('/cafe/list', { order: 'desc' });

    expect(cafes.length).toBe(activeCafeIds.length);
    const updatedAts = cafes.map((cafe) => Date.parse(cafe.updatedAt));
    for (let i = 0; i < cafes.length - 1; i += 1) {
      expect(updatedAts[i]).toBeGreaterThanOrEqual(updatedAts[i + 1]);
    }
  });

  test('Can list all cafes: order by name ascending', async () => {
    const cafes = await sweepCafes('/cafe/list', {
      orderBy: 'name',
    });

    expect(cafes.length).toBe(activeCafeIds.length);
    const names = cafes.map((cafe) => cafe.name);
    for (let i = 0; i < cafes.length - 1; i += 1) {
      expect(activeCafeNames).toContain(names[i]);
      expect(names[i] <= names[i + 1]).toBe(true);
    }
  });

  test('Can list all cafes: order by state ascending', async () => {
    const cafes = await sweepCafes(
      '/cafe/list',
      {
        orderBy: 'state',
        order: 'asc',
        showHidden: true,
      },
      true
    );

    expect(cafes.length).toBe(NUM_TEST_CAFES);
    for (let i = 0; i < cafes.length; i += 1) {
      if (i < activeCafeIds.length) {
        expect(cafes[i].state).toBe('active');
      } else {
        expect(cafes[i].state).toBe('hidden');
      }
    }
  });

  test('Can list all cafes: order by numImages descending', async () => {
    const cafes = await sweepCafes('/cafe/list', {
      orderBy: 'numImages',
      order: 'desc',
    });

    expect(cafes.length).toBe(activeCafeIds.length);
    for (let i = 0; i < cafes.length - 1; i += 1) {
      expect(cafes[i].image.count).toBeGreaterThanOrEqual(
        cafes[i + 1].image.count
      );
    }
  });

  test('Can list cafes using keyword', async () => {
    const cafesEmpty = await sweepCafes('/cafe/list', { keyword: '성수동' });

    expect(cafesEmpty.length).toBe(0);

    const cafes = await sweepCafes('/cafe/list', { keyword: '연남' });

    expect(cafes.length).toBe(numCafesInYeonnam);
  });

  test('Can count hidden cafe images', async () => {
    const cafes = await sweepCafes(
      '/cafe/list',
      { showHidden: true, showHiddenImages: true },
      true
    );

    expect(cafes.length).toBe(NUM_TEST_CAFES);
    cafes.forEach((cafe) => {
      const reference = cafeIds.findIndex((id) => cafe.id === id);
      expect(reference).toBeGreaterThanOrEqual(0);
      expect(cafe.image.count).toBe(reference % 5);
    });
  });

  test('Cafe item contains its images', async () => {
    const response = await request
      .get('/cafe/list')
      .query({ limit: 10 })
      .expect(HTTP_OK);

    const {
      cafe: { list: cafeList },
    } = response.body as { cafe: { list: SimpleCafe[] } };

    cafeList.forEach((cafe) => {
      const {
        id,
        image: { count, list: imageList },
      } = cafe;

      const index = cafeIds.findIndex((item) => id === item);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(NUM_TEST_CAFES);

      expect(count).toBe(Math.ceil((index % 5) * 0.5));
      expect(imageList.length).toBe(count);
      imageList.forEach((image, imageIndex) => {
        expect(image.index).toBe(imageIndex);
        expect(image.state).toBe('active');
        expect(image.relativeUri).toBe(`/image/${index}/${2 * image.index}`);
      });
    });
  });

  test('showHiddenImages=true retrieves hidden images', async () => {
    const response = await request
      .get('/cafe/list')
      .query({ limit: 10, showHiddenImages: true })
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .expect(HTTP_OK);

    const {
      cafe: { list: cafeList },
    } = response.body as { cafe: { list: SimpleCafe[] } };

    cafeList.forEach((cafe) => {
      const {
        id,
        image: { count, list: imageList },
      } = cafe;

      const index = cafeIds.findIndex((item) => id === item);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(NUM_TEST_CAFES);

      expect(count).toBe(index % 5);
      expect(imageList.length).toBe(count);
      imageList.forEach((image, imageIndex) => {
        expect(image.index).toBe(imageIndex);
        expect(image.relativeUri).toBe(`/image/${index}/${image.index}`);
        if (imageIndex % 2 === 0) {
          expect(image.state).toBe('active');
        } else {
          expect(image.state).toBe('hidden');
        }
      });
    });
  });

  test('Can list all cafes in place using place id', async () => {
    const cafesInPankyo = await sweepCafes('/cafe/list', {
      placeId: placeIds[0],
    });

    expect(cafesInPankyo.length).toBe(numCafesInPankyo);

    const cafesInYeonnam = await sweepCafes('/cafe/list', {
      placeId: placeIds[1],
    });

    expect(cafesInYeonnam.length).toBe(numCafesInYeonnam);
  });

  test('Can retrieve number of cafes using place name', async () => {
    const cafesInPankyo = await sweepCafes('/cafe/list', { placeName: '판교' });

    expect(cafesInPankyo.length).toBe(numCafesInPankyo);

    const cafesInYeonnam = await sweepCafes('/cafe/list', {
      placeName: '연남동',
    });

    expect(cafesInYeonnam.length).toBe(numCafesInYeonnam);
  });

  test('Partial place name does not count cafes', async () => {
    const cafesInYeonnamPartial = await sweepCafes('/cafe/list', {
      placeName: '연남',
    });

    expect(cafesInYeonnamPartial.length).toBe(0);
  });

  test('Cannot use place id and place name together', async () => {
    await request
      .get('/cafe/list')
      .query({ limit: 10, placeId: placeIds[0], placeName: '판교' })
      .expect(HTTP_BAD_REQUEST);
  });
});
