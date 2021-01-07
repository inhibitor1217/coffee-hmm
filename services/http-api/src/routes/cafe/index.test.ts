import { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import { HTTP_FORBIDDEN, HTTP_NOT_FOUND, HTTP_OK } from '../../const';
import Cafe, { CafeState } from '../../entities/cafe';
import CafeImage, { CafeImageState } from '../../entities/cafeImage';
import CafeStatistic from '../../entities/cafeStatistic';
import Place from '../../entities/place';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../../test';
import { KoaServer } from '../../types/koa';
import { env } from '../../util';
import { IamPolicy, IamRule, OperationType } from '../../util/iam';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

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
      expect(mainImageIndex ?? 0).toBeLessThan(images.length);

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

    return { cafe, cafeImages, cafeStatistic };
  });
};

beforeAll(async () => {
  connection = await createConnection(
    ormConfigs.worker(parseInt(env('JEST_WORKER_ID'), 10))
  );

  const { server: _server, request: _request } = openServer();
  server = _server;
  request = _request;
});

afterAll(async () => {
  await connection?.close();
  await closeServer(server);
});

beforeEach(async () => {
  await cleanDatabase(connection);
});

describe('Cafe - GET /cafe/:cafeId', () => {
  test('Can retrieve an active cafe', async () => {
    const place = await setupPlace({ name: '판교' });
    const { cafe } = await setupCafe({
      name: '카페__000',
      placeId: place.id,
      metadata: { hours: '09:00 ~ 20:00' },
      state: CafeState.active,
    });

    const response = await request.get(`/cafe/${cafe.id}`).expect(HTTP_OK);
    expect(response.body).toEqual({
      cafe: {
        id: cafe.id,
        createdAt: cafe.createdAt.toISOString(),
        updatedAt: cafe.updatedAt.toISOString(),
        name: '카페__000',
        place: {
          id: place.id,
          createdAt: place.createdAt.toISOString(),
          updatedAt: place.updatedAt.toISOString(),
          name: '판교',
        },
        metadata: {
          hours: '09:00 ~ 20:00',
        },
        state: 'active',
        image: {
          count: 0,
        },
        views: {
          daily: 0,
          weekly: 0,
          monthly: 0,
          total: 0,
        },
        numLikes: 0,
      },
    });
  });

  test('Throws 404 if cafe does not exist', async () => {
    const place = await setupPlace({ name: '판교' });
    await setupCafe({
      name: '카페__000',
      placeId: place.id,
      metadata: { hours: '09:00 ~ 20:00' },
      state: CafeState.active,
    });

    await request.get(`/cafe/${uuid.v4()}`).expect(HTTP_NOT_FOUND);
  });

  test('Can retireve a hidden cafe with right privileges', async () => {
    const place = await setupPlace({ name: '성수동' });
    const { cafe, cafeImages } = await setupCafe({
      name: '카페__000',
      placeId: place.id,
      metadata: { hours: '09:00 ~ 20:00' },
      state: CafeState.hidden,
      images: [
        {
          uri: '/images/0',
          state: CafeImageState.active,
        },
        {
          uri: '/images/1',
          state: CafeImageState.active,
        },
        {
          uri: '/images/2',
          state: CafeImageState.active,
        },
      ],
      mainImageIndex: 1,
      views: {
        total: 34,
      },
      numLikes: 2,
    });

    const response = await request
      .get(`/cafe/${cafe.id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .expect(HTTP_OK);

    expect(response.body).toEqual({
      cafe: {
        id: cafe.id,
        createdAt: cafe.createdAt.toISOString(),
        updatedAt: cafe.updatedAt.toISOString(),
        name: '카페__000',
        place: {
          id: place.id,
          createdAt: place.createdAt.toISOString(),
          updatedAt: place.updatedAt.toISOString(),
          name: '성수동',
        },
        metadata: {
          hours: '09:00 ~ 20:00',
        },
        state: 'hidden',
        image: {
          count: 3,
          list: [
            {
              id: cafeImages[0].id,
              createdAt: cafeImages[0].createdAt.toISOString(),
              updatedAt: cafeImages[0].updatedAt.toISOString(),
              cafeId: cafe.id,
              index: 0,
              isMain: false,
              metadata: null,
              relativeUri: '/images/0',
              state: 'active',
            },
            {
              id: cafeImages[1].id,
              createdAt: cafeImages[1].createdAt.toISOString(),
              updatedAt: cafeImages[1].updatedAt.toISOString(),
              cafeId: cafe.id,
              index: 1,
              isMain: true,
              metadata: null,
              relativeUri: '/images/1',
              state: 'active',
            },
            {
              id: cafeImages[2].id,
              createdAt: cafeImages[2].createdAt.toISOString(),
              updatedAt: cafeImages[2].updatedAt.toISOString(),
              cafeId: cafe.id,
              index: 2,
              isMain: false,
              metadata: null,
              relativeUri: '/images/2',
              state: 'active',
            },
          ],
        },
        views: {
          daily: 0,
          weekly: 0,
          monthly: 0,
          total: 34,
        },
        numLikes: 2,
      },
    });
  });

  test('Cannot retrieve a hidden cafe without privileges', async () => {
    const place = await setupPlace({ name: '성수동' });
    const { cafe } = await setupCafe({
      name: '카페__000',
      placeId: place.id,
      metadata: { hours: '09:00 ~ 20:00' },
      state: CafeState.hidden,
      images: [
        {
          uri: '/images/0',
          state: CafeImageState.active,
        },
        {
          uri: '/images/1',
          state: CafeImageState.active,
        },
        {
          uri: '/images/2',
          state: CafeImageState.active,
        },
      ],
      mainImageIndex: 1,
      views: {
        total: 34,
      },
      numLikes: 2,
    });

    await request.get(`/cafe/${cafe.id}`).expect(HTTP_FORBIDDEN);
  });

  test('Can retrieve hidden cafe images with right privileges', async () => {
    const place = await setupPlace({ name: '성수동' });
    const { cafe, cafeImages } = await setupCafe({
      name: '카페__000',
      placeId: place.id,
      metadata: { hours: '09:00 ~ 20:00' },
      state: CafeState.active,
      images: [
        {
          uri: '/images/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/images/1',
          state: CafeImageState.active,
          metadata: { tag: '현관' },
        },
      ],
      mainImageIndex: 1,
    });

    const response = await request
      .get(`/cafe/${cafe.id}?showHiddenImages=true`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .expect(HTTP_OK);

    expect(response.body).toEqual({
      cafe: {
        id: cafe.id,
        createdAt: cafe.createdAt.toISOString(),
        updatedAt: cafe.updatedAt.toISOString(),
        name: '카페__000',
        place: {
          id: place.id,
          createdAt: place.createdAt.toISOString(),
          updatedAt: place.updatedAt.toISOString(),
          name: '성수동',
        },
        metadata: {
          hours: '09:00 ~ 20:00',
        },
        state: 'active',
        image: {
          count: 2,
          list: [
            {
              id: cafeImages[0].id,
              createdAt: cafeImages[0].createdAt.toISOString(),
              updatedAt: cafeImages[0].updatedAt.toISOString(),
              cafeId: cafe.id,
              index: 0,
              isMain: false,
              metadata: null,
              relativeUri: '/images/0',
              state: 'hidden',
            },
            {
              id: cafeImages[1].id,
              createdAt: cafeImages[1].createdAt.toISOString(),
              updatedAt: cafeImages[1].updatedAt.toISOString(),
              cafeId: cafe.id,
              index: 1,
              isMain: true,
              metadata: { tag: '현관' },
              relativeUri: '/images/1',
              state: 'active',
            },
          ],
        },
        views: {
          daily: 0,
          weekly: 0,
          monthly: 0,
          total: 0,
        },
        numLikes: 0,
      },
    });
  });

  test('Correctly hides hidden cafe images without privileges', async () => {
    const place = await setupPlace({ name: '성수동' });
    const { cafe, cafeImages } = await setupCafe({
      name: '카페__000',
      placeId: place.id,
      metadata: { hours: '09:00 ~ 20:00' },
      state: CafeState.active,
      images: [
        {
          uri: '/images/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/images/1',
          state: CafeImageState.active,
          metadata: { tag: '현관' },
        },
      ],
      mainImageIndex: 1,
    });

    const response = await request.get(`/cafe/${cafe.id}`).expect(HTTP_OK);

    expect(response.body).toEqual({
      cafe: {
        id: cafe.id,
        createdAt: cafe.createdAt.toISOString(),
        updatedAt: cafe.updatedAt.toISOString(),
        name: '카페__000',
        place: {
          id: place.id,
          createdAt: place.createdAt.toISOString(),
          updatedAt: place.updatedAt.toISOString(),
          name: '성수동',
        },
        metadata: {
          hours: '09:00 ~ 20:00',
        },
        state: 'active',
        image: {
          count: 1,
          list: [
            {
              id: cafeImages[1].id,
              createdAt: cafeImages[1].createdAt.toISOString(),
              updatedAt: cafeImages[1].updatedAt.toISOString(),
              cafeId: cafe.id,
              index: 0,
              isMain: true,
              metadata: { tag: '현관' },
              relativeUri: '/images/1',
              state: 'active',
            },
          ],
        },
        views: {
          daily: 0,
          weekly: 0,
          monthly: 0,
          total: 0,
        },
        numLikes: 0,
      },
    });
  });

  test('Cannot retrieve hidden cafe images without privileges', async () => {
    const place = await setupPlace({ name: '성수동' });
    const { cafe } = await setupCafe({
      name: '카페__000',
      placeId: place.id,
      metadata: { hours: '09:00 ~ 20:00' },
      state: CafeState.active,
      images: [
        {
          uri: '/images/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/images/1',
          state: CafeImageState.active,
          metadata: { tag: '현관' },
        },
      ],
      mainImageIndex: 1,
    });

    await request
      .get(`/cafe/${cafe.id}?showHiddenImages=true`)
      .expect(HTTP_FORBIDDEN);
  });
});
