import { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from '../../../const';
import { CafeState } from '../../../entities/cafe';
import CafeImage, { CafeImageState } from '../../../entities/cafeImage';
import {
  cleanDatabase,
  closeServer,
  openServer,
  ormConfigs,
} from '../../../test';
import { setupCafe, setupPlace } from '../../../test/util';
import { KoaServer } from '../../../types/koa';
import { env } from '../../../util';
import { IamPolicy, IamRule, OperationType } from '../../../util/iam';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

jest.setTimeout(30000);
// eslint-disable-next-line no-console
console.log = jest.fn();

const adminerPolicyString = JSON.stringify(
  new IamPolicy({
    rules: [
      new IamRule({
        operationType: OperationType.mutation,
        operation: 'api.cafe.image',
      }),
    ],
  }).toJsonObject()
);

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

describe('Cafe Image - POST /cafe/:cafeId/image', () => {
  test('Can attach a new active image to cafe', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    const response = await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/image/3',
        metadata: {
          tag: '입구',
          width: 1080,
          height: 1920,
        },
        state: 'active',
      })
      .expect(HTTP_CREATED);

    const {
      cafe: {
        image: { index, isMain, metadata, relativeUri, state },
      },
    } = response.body as {
      cafe: {
        image: {
          index: number;
          isMain: boolean;
          metadata: AnyJson;
          relativeUri: string;
          state: string;
        };
      };
    };

    expect(index).toBe(3);
    expect(isMain).toBe(false);
    expect(metadata).toEqual({ tag: '입구', width: 1080, height: 1920 });
    expect(relativeUri).toBe('/image/3');
    expect(state).toBe('active');
  });

  test('Can attach a new hidden image to cafe', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 3,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    const response = await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/image/4',
        metadata: {
          tag: ['메뉴', '카운터'],
        },
        state: 'hidden',
      })
      .expect(HTTP_CREATED);

    const {
      cafe: {
        image: { index, isMain, metadata, relativeUri, state },
      },
    } = response.body as {
      cafe: {
        image: {
          index: number;
          isMain: boolean;
          metadata: AnyJson;
          relativeUri: string;
          state: string;
        };
      };
    };

    expect(index).toBe(4);
    expect(isMain).toBe(false);
    expect(metadata).toEqual({ tag: ['메뉴', '카운터'] });
    expect(relativeUri).toBe('/image/4');
    expect(state).toBe('hidden');
  });

  test('Sets the newly attached image as main image, if this is the only active image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: null,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
      ],
    });

    const response = await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/image/2',
        state: 'active',
      })
      .expect(HTTP_CREATED);

    const {
      cafe: {
        image: { index, isMain, metadata, relativeUri, state },
      },
    } = response.body as {
      cafe: {
        image: {
          index: number;
          isMain: boolean;
          metadata: AnyJson;
          relativeUri: string;
          state: string;
        };
      };
    };

    expect(index).toBe(2);
    expect(isMain).toBe(true);
    expect(metadata).toBe(null);
    expect(relativeUri).toBe('/image/2');
    expect(state).toBe('active');
  });

  test('Cannot create image with deleted state', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 3,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/image/4',
        metadata: {
          tag: ['메뉴', '카운터'],
        },
        state: 'deleted',
      })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if cafe does not exist', async () => {
    await request
      .post(`/cafe/${uuid.v4()}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/image/0',
        metadata: {
          tag: ['메뉴', '카운터'],
        },
        state: 'active',
      })
      .expect(HTTP_NOT_FOUND);
  });
});

describe('Cafe Image - PUT /cafe/:cafeId/image', () => {
  test('Can reorder and set main image: consistent case 1', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 3,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    const response = await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: cafeImages[1].id,
            index: 0,
            isMain: true,
          },
          {
            id: cafeImages[0].id,
            index: 3,
          },
          {
            id: cafeImages[3].id,
            index: 1,
            isMain: false,
          },
        ],
      })
      .expect(HTTP_OK);

    const {
      cafe: {
        id,
        image: { count, list },
      },
    } = response.body as {
      cafe: {
        id: string;
        image: {
          count: number;
          list: {
            id: string;
            index: number;
            isMain: boolean;
            relativeUri: string;
            state: string;
          }[];
        };
      };
    };

    expect(id).toBe(cafe.id);
    expect(count).toBe(4);
    expect(list[0]).toMatchObject({
      id: cafeImages[1].id,
      index: 0,
      isMain: true,
      relativeUri: '/image/1',
      state: 'active',
    });
    expect(list[1]).toMatchObject({
      id: cafeImages[3].id,
      index: 1,
      isMain: false,
      relativeUri: '/image/3',
      state: 'active',
    });
    expect(list[2]).toMatchObject({
      id: cafeImages[2].id,
      index: 2,
      isMain: false,
      relativeUri: '/image/2',
      state: 'active',
    });
    expect(list[3]).toMatchObject({
      id: cafeImages[0].id,
      index: 3,
      isMain: false,
      relativeUri: '/image/0',
      state: 'hidden',
    });
  });

  test('Can reorder and set main image: consistent case 2', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: null,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
      ],
    });

    const response = await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: cafeImages[0].id,
            index: 1,
          },
          {
            id: cafeImages[1].id,
            index: 0,
          },
        ],
      })
      .expect(HTTP_OK);

    const {
      cafe: {
        id,
        image: { count, list },
      },
    } = response.body as {
      cafe: {
        id: string;
        image: {
          count: number;
          list: {
            id: string;
            index: number;
            isMain: boolean;
            relativeUri: string;
            state: string;
          }[];
        };
      };
    };

    expect(id).toBe(cafe.id);
    expect(count).toBe(2);
    expect(list[0]).toMatchObject({
      id: cafeImages[1].id,
      index: 0,
      isMain: false,
      relativeUri: '/image/1',
      state: 'hidden',
    });
    expect(list[1]).toMatchObject({
      id: cafeImages[0].id,
      index: 1,
      isMain: false,
      relativeUri: '/image/0',
      state: 'hidden',
    });
  });

  test('Can reorder and set main image: consistent case 3', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    const response = await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: cafeImages[2].id,
            isMain: true,
          },
          {
            id: cafeImages[1].id,
            isMain: false,
          },
        ],
      })
      .expect(HTTP_OK);

    const {
      cafe: {
        id,
        image: { count, list },
      },
    } = response.body as {
      cafe: {
        id: string;
        image: {
          count: number;
          list: {
            id: string;
            index: number;
            isMain: boolean;
            relativeUri: string;
            state: string;
          }[];
        };
      };
    };

    expect(id).toBe(cafe.id);
    expect(count).toBe(3);
    expect(list[0]).toMatchObject({
      id: cafeImages[0].id,
      index: 0,
      isMain: false,
      relativeUri: '/image/0',
      state: 'active',
    });
    expect(list[1]).toMatchObject({
      id: cafeImages[1].id,
      index: 1,
      isMain: false,
      relativeUri: '/image/1',
      state: 'active',
    });
    expect(list[2]).toMatchObject({
      id: cafeImages[2].id,
      index: 2,
      isMain: true,
      relativeUri: '/image/2',
      state: 'active',
    });
  });

  test('Can find inconsistency: invalid indices', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 3,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: cafeImages[1],
            index: 0,
            isMain: true,
          },
          {
            id: cafeImages[0],
            index: 3,
          },
          {
            id: cafeImages[3],
            index: 2,
            isMain: false,
          },
        ],
      })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Can find inconsistency: inactive main image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: null,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
      ],
    });

    await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: cafeImages[0].id,
            isMain: true,
          },
        ],
      })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Can find inconsistency: multiple active images', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: cafeImages[2].id,
            isMain: true,
          },
        ],
      })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if cafe does not exist', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${uuid.v4()}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: cafeImages[2].id,
            isMain: true,
          },
        ],
      })
      .expect(HTTP_NOT_FOUND);
  });

  test('Throws 404 if cafe image does not exist', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: uuid.v4(),
            isMain: true,
          },
          {
            id: cafeImages[1].id,
            isMain: false,
          },
        ],
      })
      .expect(HTTP_NOT_FOUND);
  });
});

describe('Cafe Image - PUT /cafe/:cafeId/image/:cafeImageId', () => {
  test('Can modify uri, metadata of image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 3,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
          metadata: {
            tag: ['메뉴'],
            width: 1920,
            height: 1080,
          },
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    const response = await request
      .put(`/cafe/${cafe.id}/image/${cafeImages[1].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/image/1_new',
        metadata: { tag: ['메뉴', '카운터'], width: 720, height: 360 },
      })
      .expect(HTTP_OK);

    const {
      cafe: {
        id,
        image: { id: imageId, index, isMain, metadata, relativeUri, state },
      },
    } = response.body as {
      cafe: {
        id: string;
        image: {
          id: string;
          index: number;
          isMain: boolean;
          metadata: AnyJson;
          relativeUri: string;
          state: string;
        };
      };
    };

    expect(id).toBe(cafe.id);
    expect(imageId).toBe(cafeImages[1].id);
    expect(index).toBe(1);
    expect(isMain).toBe(false);
    expect(metadata).toEqual({
      tag: ['메뉴', '카운터'],
      width: 720,
      height: 360,
    });
    expect(relativeUri).toBe('/image/1_new');
    expect(state).toBe('active');
  });

  test('Can update state of cafe image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: null,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
      ],
    });

    const response = await request
      .put(`/cafe/${cafe.id}/image/${cafeImages[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ state: 'active' })
      .expect(HTTP_OK);

    const {
      cafe: {
        id,
        image: { id: imageId, index, isMain, metadata, relativeUri, state },
      },
    } = response.body as {
      cafe: {
        id: string;
        image: {
          id: string;
          index: number;
          isMain: boolean;
          metadata: AnyJson;
          relativeUri: string;
          state: string;
        };
      };
    };

    expect(id).toBe(cafe.id);
    expect(imageId).toBe(cafeImages[0].id);
    expect(index).toBe(0);
    expect(isMain).toBe(true);
    expect(metadata).toBe(null);
    expect(relativeUri).toBe('/image/0');
    expect(state).toBe('active');
  });

  test('Cannot modify image state to deleted', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${cafe.id}/image/${cafeImages[2].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ state: 'deleted' })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Cannot hide a main cafe image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${cafe.id}/image/${cafeImages[1].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ state: 'hidden' })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if cafe does not exist', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${uuid.v4()}/image/${cafeImages[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ metadata: { tag: ['카운터'] } })
      .expect(HTTP_NOT_FOUND);
  });

  test('Throws 404 if cafe image does not exist', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .put(`/cafe/${cafe.id}/image/${uuid.v4()}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ metadata: { tag: ['카운터'] } })
      .expect(HTTP_NOT_FOUND);
  });
});

describe('Cafe Image - DELETE /cafe/:cafeId/image/:cafeImageId', () => {
  test('Can delete a cafe image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    const response = await request
      .delete(`/cafe/${cafe.id}/image/${cafeImages[1].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_OK);

    const {
      cafe: {
        id,
        image: {
          list: [{ id: deletedImageId }],
        },
      },
    } = response.body as {
      cafe: { id: string; image: { list: { id: string }[] } };
    };

    expect(id).toBe(cafe.id);
    expect(deletedImageId).toBe(cafeImages[1].id);
  });

  test('After deletion, the indices of other images are correctly reassigned', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image/${cafeImages[2].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_OK);

    const updatedImages = await connection
      .getRepository(CafeImage)
      .createQueryBuilder('cafe_image')
      .select()
      .where({ fkCafeId: cafe.id })
      .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
        deleted: CafeImageState.deleted,
      })
      .orderBy({ index: 'ASC' })
      .getMany();

    expect(updatedImages.length).toBe(3);
    expect(updatedImages[0].toJsonObject()).toMatchObject({
      id: cafeImages[0].id,
      index: 0,
      isMain: true,
      state: 'active',
    });
    expect(updatedImages[1].toJsonObject()).toMatchObject({
      id: cafeImages[1].id,
      index: 1,
      isMain: false,
      state: 'hidden',
    });
    expect(updatedImages[2].toJsonObject()).toMatchObject({
      id: cafeImages[3].id,
      index: 2,
      isMain: false,
      state: 'active',
    });
  });

  test('Throws 404 if attempts to delete a deleted cafe image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image/${cafeImages[2].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_OK);

    await request
      .delete(`/cafe/${cafe.id}/image/${cafeImages[2].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_NOT_FOUND);
  });

  test('Throws 404 if cafe is not found', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${uuid.v4()}/image/${cafeImages[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_NOT_FOUND);
  });

  test('Throws 404 if cafe image is not found', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image/${uuid.v4()}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_NOT_FOUND);
  });

  test('Cannot delete a main cafe image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image/${cafeImages[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_BAD_REQUEST);
  });

  test('Can delete a main image, if no active images are left after deletion', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image/${cafeImages[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .expect(HTTP_OK);

    const updatedImages = await connection
      .getRepository(CafeImage)
      .createQueryBuilder('cafe_image')
      .select()
      .where({ fkCafeId: cafe.id })
      .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
        deleted: CafeImageState.deleted,
      })
      .orderBy({ index: 'ASC' })
      .getMany();

    expect(updatedImages.length).toBe(1);
    expect(updatedImages[0].toJsonObject()).toMatchObject({
      id: cafeImages[1].id,
      state: 'hidden',
      index: 0,
    });
  });
});

describe('Cafe Image - DELETE /cafe/:cafeId/image', () => {
  test('Can delete multiple cafe images', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
        {
          uri: '/image/4',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/5',
          state: CafeImageState.active,
        },
      ],
    });

    const response = await request
      .delete(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[3].id, cafeImages[4].id, cafeImages[1].id] })
      .expect(HTTP_OK);

    const {
      cafe: {
        id,
        image: { list },
      },
    } = response.body as {
      cafe: { id: string; image: { list: { id: string }[] } };
    };

    expect(id).toBe(cafe.id);
    expect(list).toEqual([
      { id: cafeImages[3].id },
      { id: cafeImages[4].id },
      { id: cafeImages[1].id },
    ]);
  });

  test('After deletion, the indices of other images are correctly reassigned', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
        {
          uri: '/image/4',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/5',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[3].id, cafeImages[4].id, cafeImages[1].id] })
      .expect(HTTP_OK);

    const updatedImages = await connection
      .getRepository(CafeImage)
      .createQueryBuilder('cafe_image')
      .select()
      .where({ fkCafeId: cafe.id })
      .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
        deleted: CafeImageState.deleted,
      })
      .orderBy({ index: 'ASC' })
      .getMany();

    expect(updatedImages.length).toBe(3);
    expect(updatedImages[0].toJsonObject()).toMatchObject({
      id: cafeImages[0].id,
      state: 'active',
      index: 0,
    });
    expect(updatedImages[1].toJsonObject()).toMatchObject({
      id: cafeImages[2].id,
      state: 'hidden',
      index: 1,
    });
    expect(updatedImages[2].toJsonObject()).toMatchObject({
      id: cafeImages[5].id,
      state: 'active',
      index: 2,
    });
  });

  test('Throws 404 if one of cafe is already deleted', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 2,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[0].id, cafeImages[1].id] })
      .expect(HTTP_OK);

    await request
      .delete(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[3].id, cafeImages[1].id] })
      .expect(HTTP_NOT_FOUND);
  });

  test('Throws 404 if cafe is not found', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${uuid.v4()}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[0].id, cafeImages[2].id] })
      .expect(HTTP_NOT_FOUND);
  });

  test('Throws 404 if one of cafe image is not found', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 1,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.active,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[0].id, uuid.v4(), uuid.v4()] })
      .expect(HTTP_NOT_FOUND);
  });

  test('Cannot delete if one of given image was main image', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 2,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
        {
          uri: '/image/2',
          state: CafeImageState.active,
        },
        {
          uri: '/image/3',
          state: CafeImageState.active,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[0].id, cafeImages[2].id] })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Can delete a main image, if no active images are left after deletion', async () => {
    const place = await setupPlace(connection, { name: '연남동' });
    const { cafe, cafeImages } = await setupCafe(connection, {
      name: '커피밀',
      placeId: place.id,
      state: CafeState.active,
      mainImageIndex: 0,
      images: [
        {
          uri: '/image/0',
          state: CafeImageState.active,
        },
        {
          uri: '/image/1',
          state: CafeImageState.hidden,
        },
      ],
    });

    await request
      .delete(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [cafeImages[0].id] })
      .expect(HTTP_OK);

    const updatedImages = await connection
      .getRepository(CafeImage)
      .createQueryBuilder('cafe_image')
      .select()
      .where({ fkCafeId: cafe.id })
      .andWhere(`cafe_image.state IS DISTINCT FROM :deleted`, {
        deleted: CafeImageState.deleted,
      })
      .orderBy({ index: 'ASC' })
      .getMany();

    expect(updatedImages.length).toBe(1);
    expect(updatedImages[0].toJsonObject()).toMatchObject({
      id: cafeImages[1].id,
      state: 'hidden',
      index: 0,
    });
  });
});
