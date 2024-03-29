import {
  IamPolicy,
  IamRule,
  Place,
  OperationType,
  CafeState,
} from '@coffee-hmm/common';
import _ from 'lodash';
import { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from '../../const';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../../test';
import { setupCafe, setupPlace } from '../../test/util';
import { KoaServer } from '../../types/koa';
import { env } from '../../util';

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
        operation: 'api.place',
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

describe('Place - GET /place/list', () => {
  test('Can retrieve an entire list of places', async () => {
    const places = await Promise.all(
      ['판교', '연남동', '양재', '성수동', '한남'].map((name) =>
        setupPlace(connection, { name })
      )
    );

    const PLACE_INDICES = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
    await Promise.all(
      _.range(PLACE_INDICES.length).map((i) =>
        setupCafe(connection, {
          name: `cafe_${`${i}`.padStart(3, '0')}`,
          placeId: places[PLACE_INDICES[i]].id,
          state: i % 3 === 0 ? CafeState.hidden : CafeState.active,
        })
      )
    );

    const response = await request.get('/place/list').expect(HTTP_OK);
    const {
      place: { count, list },
    } = response.body as {
      place: {
        count: number;
        list: {
          id: string;
          name: string;
          pinned: boolean;
          cafeCount: number;
        }[];
      };
    };
    const names = list.map((item) => item.name);

    expect(count).toBe(5);

    expect(names[0]).toEqual('양재');
    expect(names.sort()).toEqual(
      ['판교', '연남동', '양재', '성수동', '한남'].sort()
    );

    expect(list[0].cafeCount).toBe(2);
    expect(list[1].cafeCount).toBe(1);
    expect(list[2].cafeCount).toBe(1);
    expect(list[3].cafeCount).toBe(1);
    expect(list[4].cafeCount).toBe(1);

    list.forEach(({ pinned }) => expect(pinned).toBe(false));
  });

  test('Can retrieve a pinned list of places', async () => {
    await setupPlace(connection, { name: '판교', pinned: true });
    await setupPlace(connection, { name: '연남동', pinned: false });
    const { id: placeId } = await setupPlace(connection, {
      name: '양재',
      pinned: true,
    });
    await setupPlace(connection, { name: '성수동', pinned: false });

    await setupCafe(connection, {
      name: 'cafe_000',
      state: CafeState.active,
      placeId,
    });
    await setupCafe(connection, {
      name: 'cafe_001',
      state: CafeState.active,
      placeId,
    });
    await setupCafe(connection, {
      name: 'cafe_002',
      state: CafeState.active,
      placeId,
    });

    const response = await request
      .get('/place/list')
      .query({ pinned: true })
      .expect(HTTP_OK);
    const {
      place: { count, list },
    } = response.body as {
      place: {
        count: number;
        list: {
          id: string;
          name: string;
          pinned: boolean;
          cafeCount: number;
        }[];
      };
    };
    const names = list.map((item) => item.name);

    expect(count).toBe(1);
    expect(names).toEqual(['양재']);
    expect(list[0].cafeCount).toBe(3);
  });

  test('Filters places with only hidden or deleted cafes', async () => {
    const place0 = await setupPlace(connection, { name: '판교' });
    const place1 = await setupPlace(connection, { name: '연남동' });

    await setupCafe(connection, {
      name: 'cafe_000',
      state: CafeState.hidden,
      placeId: place0.id,
    });
    await setupCafe(connection, {
      name: 'cafe_001',
      state: CafeState.active,
      placeId: place1.id,
    });
    await setupCafe(connection, {
      name: 'cafe_002',
      state: CafeState.active,
      placeId: place1.id,
    });

    const response = await request.get('/place/list').expect(HTTP_OK);

    const {
      place: { count, list },
    } = response.body as {
      place: {
        count: number;
        list: {
          id: string;
          name: string;
          pinned: boolean;
          cafeCount: number;
        }[];
      };
    };

    expect(count).toBe(1);

    expect(list[0].name).toBe('연남동');
    expect(list[0].cafeCount).toBe(2);
  });
});

describe('Place - POST /place', () => {
  test('Can create a place', async () => {
    const response = await request
      .post('/place')
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ name: '양재' })
      .expect(HTTP_CREATED);

    const {
      place: { name },
    } = response.body as { place: { name: string } };

    expect(name).toBe('양재');
  });

  test('Requires privilege to create a place', async () => {
    await request.post('/place').send({ name: '양재' }).expect(HTTP_FORBIDDEN);
  });

  test('Throws 400 if the place with given name already exists', async () => {
    await setupPlace(connection, { name: '양재' });

    await request
      .post('/place')
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ name: '양재' })
      .expect(HTTP_BAD_REQUEST);
  });
});

describe('Place - PUT /place/:placeId', () => {
  test('Can update a name of place', async () => {
    const places = await Promise.all(
      ['양재', '성수동'].map((name) => setupPlace(connection, { name }))
    );

    const response = await request
      .put(`/place/${places[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ name: '판교' })
      .expect(HTTP_OK);

    const {
      place: { id, name },
    } = response.body as { place: { id: string; name: string } };

    expect(id).toBe(places[0].id);
    expect(name).toBe('판교');

    const updated = await connection.getRepository(Place).findOne(places[0].id);
    expect(updated?.name).toBe('판교');
  });

  test('Cannot update to a name that already exists', async () => {
    const places = await Promise.all(
      ['양재', '성수동'].map((name) => setupPlace(connection, { name }))
    );

    await request
      .put(`/place/${places[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ name: '성수동' })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if place does not exist', async () => {
    await Promise.all(
      ['양재', '성수동'].map((name) => setupPlace(connection, { name }))
    );

    await request
      .put(`/place/${uuid.v4()}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ name: '판교' })
      .expect(HTTP_NOT_FOUND);
  });
});

describe('Place - DELETE /place/:placeId', () => {
  test('Can delete a place without any connected cafes', async () => {
    const places = await Promise.all(
      ['양재', '성수동'].map((name) => setupPlace(connection, { name }))
    );

    const response = await request
      .delete(`/place/${places[1].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_OK);

    const {
      place: { id },
    } = response.body as { place: { id: string } };

    expect(id).toBe(places[1].id);
  });

  test('Cannot delete a place with connected cafe', async () => {
    const places = await Promise.all(
      ['양재', '성수동'].map((name) => setupPlace(connection, { name }))
    );
    await setupCafe(connection, { name: '알레그리아', placeId: places[0].id });
    await setupCafe(connection, { name: '커피밀', placeId: places[0].id });

    await request
      .delete(`/place/${places[0].id}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if cafe does not exist', async () => {
    await Promise.all(
      ['양재', '성수동'].map((name) => setupPlace(connection, { name }))
    );

    await request
      .delete(`/place/${uuid.v4()}`)
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send()
      .expect(HTTP_NOT_FOUND);
  });
});

describe('Place - DELETE /place', () => {
  test('Can delete a list of places', async () => {
    const places = await Promise.all(
      ['양재', '성수동', '판교'].map((name) => setupPlace(connection, { name }))
    );
    await setupCafe(connection, { name: '알레그리아', placeId: places[1].id });
    await setupCafe(connection, { name: '커피밀', placeId: places[1].id });

    const response = await request
      .delete('/place')
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [places[0].id, places[2].id] })
      .expect(HTTP_OK);

    const {
      place: { list },
    } = response.body as { place: { list: { id: string }[] } };

    const deletedIds = list.map((item) => item.id);
    expect(deletedIds.sort()).toEqual([places[0].id, places[2].id].sort());

    const allPlaces = await connection.getRepository(Place).find();
    expect(allPlaces.length).toBe(1);
    expect(allPlaces[0].id).toBe(places[1].id);
    expect(allPlaces[0].name).toBe('성수동');
  });

  test('Cannot delete if one of given places has connected cafes', async () => {
    const places = await Promise.all(
      ['양재', '성수동', '판교'].map((name) => setupPlace(connection, { name }))
    );
    await setupCafe(connection, { name: '알레그리아', placeId: places[1].id });
    await setupCafe(connection, { name: '커피밀', placeId: places[1].id });

    await request
      .delete('/place')
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [places[0].id, places[1].id] })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if one of given places is not found', async () => {
    const places = await Promise.all(
      ['양재', '성수동', '판교'].map((name) => setupPlace(connection, { name }))
    );

    await request
      .delete('/place')
      .set({
        'x-debug-user-id': uuid.v4(),
        'x-debug-iam-policy': adminerPolicyString,
      })
      .send({ list: [places[0].id, places[1].id, uuid.v4()] })
      .expect(HTTP_NOT_FOUND);
  });
});
