import { SuperTest, Test } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import * as uuid from 'uuid';
import { HTTP_OK } from '../../const';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../../test';
import { KoaServer } from '../../types/koa';
import { env } from '../../util';
import { generateDefaultUserPolicy } from '../../util/iam';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

jest.setTimeout(30000);
// eslint-disable-next-line no-console
console.log = jest.fn();

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

describe('Event - POST /event', () => {
  test('Can post view book event when signed', async () => {
    const userId = uuid.v4();
    const bookId = uuid.v4();
    const response = await request
      .post('/event')
      .set({
        'x-debug-user-id': userId,
        'x-debug-iam-policy': JSON.stringify(
          generateDefaultUserPolicy().toJsonObject()
        ),
      })
      .send({
        category: 'CAFE',
        name: 'VIEW',
        value: bookId,
      })
      .expect(HTTP_OK);

    const {
      event: { userId: _userId, category, name, label, value },
    } = response.body as {
      event: {
        id: string;
        userId: string | null;
        category: string;
        name: string;
        label: string | null;
        value: string | null;
      };
    };

    expect(_userId).toBe(userId);
    expect(category).toBe('CAFE');
    expect(name).toBe('VIEW');
    expect(label).toBe(null);
    expect(value).toBe(bookId);
  });

  test('Can post view book event when signed', async () => {
    const bookId = uuid.v4();
    const response = await request
      .post('/event')
      .send({
        category: 'CAFE',
        name: 'VIEW',
        value: bookId,
      })
      .expect(HTTP_OK);

    const {
      event: { userId, category, name, label, value },
    } = response.body as {
      event: {
        id: string;
        userId: string | null;
        category: string;
        name: string;
        label: string | null;
        value: string | null;
      };
    };

    expect(userId).toBe(null);
    expect(category).toBe('CAFE');
    expect(name).toBe('VIEW');
    expect(label).toBe(null);
    expect(value).toBe(bookId);
  });
});
