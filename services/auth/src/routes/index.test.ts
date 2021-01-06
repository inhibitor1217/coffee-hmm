import { SuperTest, Test } from 'supertest';
import { Connection, createConnection, getRepository } from 'typeorm';
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_FORBIDDEN,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from '../const';
import Policy from '../entities/policy';
import User from '../entities/user';
import UserProfile from '../entities/userProfile';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../test';
import { firebaseCustomIdToken } from '../test/util';
import { KoaServer } from '../types/koa';
import { buildString, env } from '../util';
import { generateDefaultUserPolicy } from '../util/iam';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

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

describe('Heartbeat', () => {
  test('Server is alive and responding', async () => {
    const response = await request.get('/').expect(HTTP_OK);
    expect(response.body).toEqual({ msg: `${buildString()} is alive!` });
  });
});

describe('General - POST /register', () => {
  test('Can retrieve firebase custom id token', async () => {
    const idToken = await firebaseCustomIdToken('test');
    expect(idToken).toBeTruthy();
  });

  test('Throws 401 if id token is invalid', async () => {
    await request
      .post('/register')
      .query({ id_token: 'foo' })
      .send({ profile: { name: 'foo', email: 'foo@example.com' } })
      .expect(HTTP_UNAUTHORIZED);
  });

  test('Throws 400 if schema is invalid', async () => {
    await request
      .post('/register')
      .send({ profile: { name: 'foo' } })
      .expect(HTTP_BAD_REQUEST);

    const idToken = await firebaseCustomIdToken('test');

    await request
      .post('/register')
      .query({ id_token: idToken })
      .expect(HTTP_BAD_REQUEST);

    await request
      .post('/register')
      .query({ id_token: idToken })
      .send({ profile: { email: 'foo@example.com' } })
      .expect(HTTP_BAD_REQUEST);

    await request
      .post('/register')
      .query({ id_token: idToken })
      .send({ profile: { email: 'foofoo' } })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Correctly creates a user', async () => {
    const idToken = await firebaseCustomIdToken('test');

    const response = await request
      .post('/register')
      .query({ id_token: idToken })
      .send({ profile: { name: 'foo', email: 'foo@example.com' } })
      .expect(HTTP_CREATED);

    const {
      user: { userProfileId, policyId, state, provider, providerUserId },
    } = response.body as {
      user: {
        userProfileId: string;
        policyId: string;
        state: string;
        provider: string;
        providerUserId: string;
      };
    };

    expect(state).toBe('active');
    expect(provider).toBe('custom');
    expect(providerUserId).toBe('test');

    const profile = await connection
      .getRepository(UserProfile)
      .findOne(userProfileId);

    expect(profile).toBeTruthy();
    expect(profile?.name).toBe('foo');
    expect(profile?.email).toBe('foo@example.com');

    const policy = await connection.getRepository(Policy).findOne(policyId);

    expect(policy).toBeTruthy();
    expect(policy?.name).toBe('DefaultUserPolicy');
    expect(policy?.value).toBe(
      JSON.stringify(generateDefaultUserPolicy().toJsonObject())
    );
  });

  test('Cannot create duplicate user', async () => {
    const idToken = await firebaseCustomIdToken('test');

    await request
      .post('/register')
      .query({ id_token: idToken })
      .send({ profile: { name: 'foo', email: 'foo@example.com' } })
      .expect(HTTP_CREATED);

    await request
      .post('/register')
      .query({ id_token: idToken })
      .send({
        profile: { name: 'foo.another', email: 'foo.another@example.com' },
      })
      .expect(HTTP_BAD_REQUEST);
  });
});

describe('General - GET /token', () => {
  test('Throws 401 without valid id token', async () => {
    await request
      .get('/token')
      .query({ id_token: 'foo' })
      .expect(HTTP_UNAUTHORIZED);
  });

  test('Throws 400 without id token', async () => {
    await request.get('/token').expect(HTTP_BAD_REQUEST);
  });

  test('Throws 403 if not registered', async () => {
    const idToken = await firebaseCustomIdToken('test');

    await request
      .get('/token')
      .query({ id_token: idToken })
      .expect(HTTP_FORBIDDEN);
  });

  test('Correctly retrieves id token and last signed at', async () => {
    const idToken = await firebaseCustomIdToken('test');

    const registerResponse = await request
      .post('/register')
      .query({ id_token: idToken })
      .send({ profile: { name: 'foo' } })
      .expect(HTTP_CREATED);
    const {
      user: { id: userId },
    } = registerResponse.body as { user: { id: string } };

    const response = await request
      .get('/token')
      .query({ id_token: idToken })
      .expect(HTTP_OK);

    const { token } = response.body as { token: string };
    expect(token).toBeTruthy();

    const user = await getRepository(User).findOne(userId);
    expect(user?.lastSignedAt).toBeTruthy();
  });
});
