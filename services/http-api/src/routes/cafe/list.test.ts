import pLimit from 'p-limit';
import { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import { HTTP_OK } from '../../const';
import Cafe, { CafeState, CafeStateStrings } from '../../entities/cafe';
import CafeImage, { CafeImageState } from '../../entities/cafeImage';
import CafeImageCount from '../../entities/cafeImageCount';
import CafeStatistic from '../../entities/cafeStatistic';
import Place from '../../entities/place';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../../test';
import { KoaServer } from '../../types/koa';
import { env } from '../../util';
import { IamPolicy, IamRule, OperationType } from '../../util/iam';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

let cafeIds: string[];
let activeCafeIds: string[];
let activeCafeNames: string[];

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

const setupPlace = async ({ name }: { name: string }) => {
  const place = await connection
    .createQueryBuilder(Place, 'place')
    .insert()
    .values({ name })
    .returning(Place.columns)
    .execute()
    .then((insertResult) =>
      Place.fromRawColumns((insertResult.raw as Record<string, unknown>[])[0], {
        connection,
      })
    );

  return place;
};

const setupCafe = async ({
  name,
  placeId,
  metadata,
  state,
  images,
  mainImageIndex,
  views,
  numLikes,
}: {
  name: string;
  placeId: string;
  metadata?: AnyJson;
  state?: CafeState;
  images?: {
    uri: string;
    state: CafeImageState;
    metadata?: AnyJson;
  }[];
  mainImageIndex?: number;
  views?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
    total?: number;
  };
  numLikes?: number;
}) => {
  return connection.transaction(async (manager) => {
    const cafe = await manager
      .createQueryBuilder(Cafe, 'cafe')
      .insert()
      .values({
        name,
        fkPlaceId: placeId,
        metadata: JSON.stringify(metadata),
        state: state ?? CafeState.hidden,
      })
      .returning(Cafe.columns)
      .execute()
      .then((insertResult) =>
        Cafe.fromRawColumns(
          (insertResult.raw as Record<string, unknown>[])[0],
          {
            connection,
          }
        )
      );

    let cafeImages: CafeImage[] = [];
    if (images) {
      if (images.length === 0) {
        expect(mainImageIndex).toBeFalsy();
      } else {
        expect(mainImageIndex ?? 0).toBeLessThan(images.length);
      }

      cafeImages = await Promise.all(
        images.map((image, index) =>
          manager
            .createQueryBuilder(CafeImage, 'cafe_image')
            .insert()
            .values({
              fkCafeId: cafe.id,
              index,
              isMain: index === (mainImageIndex ?? 0),
              metadata: JSON.stringify(image.metadata),
              relativeUri: image.uri,
              state: image.state,
            })
            .returning(CafeImage.columns)
            .execute()
            .then((insertResult) =>
              CafeImage.fromRawColumns(
                (insertResult.raw as Record<string, unknown>[])[0],
                {
                  connection,
                }
              )
            )
        )
      );
    }

    const cafeStatistic = await manager
      .createQueryBuilder(CafeStatistic, 'cafe_statistic')
      .insert()
      .values({
        fkCafeId: cafe.id,
        dailyViews: views?.daily ?? 0,
        weeklyViews: views?.weekly ?? 0,
        monthlyViews: views?.monthly ?? 0,
        totalViews: views?.total ?? 0,
        numReviews: 0,
        sumRatings: 0,
        numLikes: numLikes ?? 0,
      })
      .returning(CafeStatistic.columns)
      .execute()
      .then((insertResult) =>
        CafeStatistic.fromRawColumns(
          (insertResult.raw as Record<string, number>[])[0],
          { connection }
        )
      );

    const cafeImageCount = await manager
      .createQueryBuilder(CafeImageCount, 'cafe_image_count')
      .insert()
      .values({
        fkCafeId: cafe.id,
        total: images?.length ?? 0,
        active:
          images?.filter((image) => image.state === CafeImageState.active)
            ?.length ?? 0,
      })
      .returning(CafeImageCount.columns)
      .execute()
      .then((insertResult) =>
        CafeImageCount.fromRawColumns(
          (insertResult.raw as Record<string, number>[])[0],
          { connection }
        )
      );

    return { cafe, cafeImages, cafeStatistic, cafeImageCount };
  });
};

const NUM_TEST_CAFES = 200;
const setupCafes = async (
  generateImages?: (
    index: number
  ) => { uri: string; state: CafeImageState; metadata?: AnyJson }[]
) => {
  const place = await setupPlace({ name: '판교' });

  const throttle = pLimit(16);
  const ids = await Promise.all(
    [...Array(NUM_TEST_CAFES).keys()]
      .map((i) => () =>
        setupCafe({
          name: `카페_${i.toString().padStart(3, '0')}`,
          placeId: place.id,
          state: i % 2 === 0 ? CafeState.active : CafeState.hidden,
          images: generateImages && generateImages(i),
        }).then(({ cafe }) => cafe.id)
      )
      .map((task) => throttle(task))
  );

  const activeIds = ids.filter((_, i) => i % 2 === 0);
  const names = [...Array(NUM_TEST_CAFES).keys()].map(
    (i) => `카페_${i.toString().padStart(3, '0')}`
  );
  const activeNames = names.filter((_, i) => i % 2 === 0);

  return {
    cafeIds: ids,
    activeCafeIds: activeIds,
    cafeNames: names,
    activeCafeNames: activeNames,
  };
};

type SimpleCafe = {
  id: string;
  updatedAt: string;
  name: string;
  place: { name: string };
  state: CafeStateStrings;
  image: {
    count: number;
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
  } = await setupCafes((i) =>
    [...Array(i % 5).keys()].map((j) => ({
      uri: `/image/${i}/${j}`,
      state: j % 2 === 0 ? CafeImageState.active : CafeImageState.hidden,
    }))
  );

  cafeIds = _cafeIds;
  activeCafeIds = _activeCafeIds;
  activeCafeNames = _activeCafeNames;
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
      expect(item.place.name).toBe('판교');
      expect(item.state).toBe('active');
    });
  });

  test('Can list all active cafes using cursor', async () => {
    const cafes = await sweepCafes('/cafe/feed', {});

    expect(cafes.length).toBe(activeCafeIds.length);
    cafes.forEach((item) => {
      expect(activeCafeIds).toContain(item.id);
      expect(activeCafeNames).toContain(item.name);
      expect(item.place.name).toBe('판교');
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

  test('A list should be different in next day', async () => {
    const uid = uuid.v4();

    Date.now = jest.fn(() => new Date(Date.UTC(2021, 1, 1)).valueOf());

    const todayCafeIds = ((
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
    }).cafe.list.map((cafe) => cafe.id);

    Date.now = jest.fn(() => new Date(Date.UTC(2021, 1, 2)).valueOf());

    const tomorrowCafeIds = ((
      await request.get('/cafe/feed').query({ limit: 10 }).expect(HTTP_OK)
    ).body as {
      cafe: { list: SimpleCafe[] };
      cursor: string;
      identifier: string;
    }).cafe.list.map((cafe) => cafe.id);

    expect(todayCafeIds).not.toEqual(tomorrowCafeIds);
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
    const cafes = await sweepCafes('/cafe/list', { keyword: '성수동' });

    expect(cafes.length).toBe(0);
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
});
