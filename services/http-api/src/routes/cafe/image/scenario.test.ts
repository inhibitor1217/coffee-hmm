import {
  CafeState,
  IamPolicy,
  IamRule,
  OperationType,
} from '@coffee-hmm/common';
import { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import { HTTP_CREATED, HTTP_OK } from '../../../const';
import {
  cleanDatabase,
  closeServer,
  openServer,
  ormConfigs,
} from '../../../test';
import { setupCafe, setupPlace } from '../../../test/util';
import { KoaServer } from '../../../types/koa';
import { env } from '../../../util';

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

type GetSingleCafeResponseBody = {
  cafe: {
    id: string;
    image: {
      count: number;
      list: {
        id: string;
        index: number;
        isMain: boolean;
        relativeUri: string;
        metadata: AnyJson;
        state: 'active' | 'hidden';
      }[];
    };
  };
};

describe('Integrated endpoint test for cafe image mutation', () => {
  test('Scenario test', async () => {
    const place = await setupPlace(connection, { name: '판교' });
    const { cafe } = await setupCafe(connection, {
      name: '알레그리아',
      placeId: place.id,
      state: CafeState.active,
    });

    const responses = [];

    await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/images/0.png',
        metadata: { tags: ['이미지 1'] },
        state: 'active',
      })
      .expect(HTTP_CREATED);

    await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/images/1.png',
        metadata: { tags: ['이미지 2'] },
        state: 'active',
      })
      .expect(HTTP_CREATED);

    await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/images/2.png',
        metadata: { tags: ['이미지 3'] },
        state: 'hidden',
      })
      .expect(HTTP_CREATED);

    responses.push(await request.get(`/cafe/${cafe.id}`).expect(HTTP_OK));

    await request
      .put(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        list: [
          {
            id: (responses[0].body as GetSingleCafeResponseBody).cafe.image
              .list[0].id,
            isMain: false,
            index: 1,
          },
          {
            id: (responses[0].body as GetSingleCafeResponseBody).cafe.image
              .list[1].id,
            isMain: true,
            index: 0,
          },
        ],
      })
      .expect(HTTP_OK);

    await request
      .delete(
        `/cafe/${cafe.id}/image/${
          (responses[0].body as GetSingleCafeResponseBody).cafe.image.list[0].id
        }`
      )
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_OK);

    responses.push(await request.get(`/cafe/${cafe.id}`).expect(HTTP_OK));

    await request
      .post(`/cafe/${cafe.id}/image`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({
        uri: '/images/3.png',
        metadata: { tags: ['이미지 3'] },
        state: 'active',
      })
      .expect(HTTP_CREATED);

    await request
      .put(
        `/cafe/${cafe.id}/image/${
          (responses[0].body as GetSingleCafeResponseBody).cafe.image.list[1].id
        }`
      )
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ metadata: { tags: ['이미지 2', '메인'] } });

    responses.push(await request.get(`/cafe/${cafe.id}`).expect(HTTP_OK));

    expect(
      (responses[0].body as GetSingleCafeResponseBody).cafe.image.count
    ).toBe(2);
    expect(
      (responses[0].body as GetSingleCafeResponseBody).cafe.image.list[0]
        .relativeUri
    ).toBe('/images/0.png');
    expect(
      (responses[0].body as GetSingleCafeResponseBody).cafe.image.list[1]
        .relativeUri
    ).toBe('/images/1.png');
    expect(
      (responses[0].body as GetSingleCafeResponseBody).cafe.image.list[0].isMain
    ).toBe(true);

    expect(
      (responses[1].body as GetSingleCafeResponseBody).cafe.image.count
    ).toBe(1);
    expect(
      (responses[1].body as GetSingleCafeResponseBody).cafe.image.list[0]
        .relativeUri
    ).toBe('/images/1.png');
    expect(
      (responses[1].body as GetSingleCafeResponseBody).cafe.image.list[0].isMain
    ).toBe(true);

    expect(
      (responses[2].body as GetSingleCafeResponseBody).cafe.image.count
    ).toBe(2);
    expect(
      (responses[2].body as GetSingleCafeResponseBody).cafe.image.list[0]
        .relativeUri
    ).toBe('/images/1.png');
    expect(
      (responses[2].body as GetSingleCafeResponseBody).cafe.image.list[0].isMain
    ).toBe(true);
    expect(
      (responses[2].body as GetSingleCafeResponseBody).cafe.image.list[0]
        .metadata
    ).toEqual({ tags: ['이미지 2', '메인'] });
    expect(
      (responses[2].body as GetSingleCafeResponseBody).cafe.image.list[1]
        .relativeUri
    ).toBe('/images/3.png');
  });
});
