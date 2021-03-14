import {
  AuthProvider,
  generateDefaultUserPolicy,
  Policy,
  User,
  UserProfile,
  UserState,
} from '@coffee-hmm/common';
import { SuperTest, Test } from 'supertest';
import {
  Connection,
  createConnection,
  DeepPartial,
  getRepository,
} from 'typeorm';
import * as uuid from 'uuid';
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_FORBIDDEN,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from '../const';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../test';
import { firebaseCustomIdToken } from '../test/util';
import { KoaServer } from '../types/koa';
import { buildString, env } from '../util';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

// eslint-disable-next-line no-console
console.log = jest.fn();

const defaultUserPolicyString = JSON.stringify(
  generateDefaultUserPolicy().toJsonObject()
);

const setupUser = async () => {
  return connection.transaction(async (manager) => {
    const userProfile = await manager
      .createQueryBuilder(UserProfile, 'user_profile')
      .insert()
      .values({ name: `test` })
      .returning(UserProfile.columns)
      .execute()
      .then((insertResult) =>
        UserProfile.fromRawColumns(
          (insertResult.raw as DeepPartial<UserProfile>[])[0],
          { connection }
        )
      );

    const adminerPolicy = await manager
      .createQueryBuilder(Policy, 'policy')
      .insert()
      .values({
        name: 'DefaultUserPolicy',
        value: defaultUserPolicyString,
      })
      .returning(Policy.columns)
      .execute()
      .then((insertResult) =>
        Policy.fromRawColumns((insertResult.raw as DeepPartial<Policy>[])[0], {
          connection,
        })
      );

    const user = await manager
      .createQueryBuilder(User, 'user')
      .insert()
      .values({
        fkUserProfileId: userProfile.id,
        fkPolicyId: adminerPolicy.id,
        state: UserState.active,
        provider: AuthProvider.custom,
        providerUserId: `test`,
      })
      .returning(User.columns)
      .execute()
      .then((insertResult) =>
        User.fromRawColumns((insertResult.raw as DeepPartial<User>[])[0], {
          connection,
        })
      );

    return user.id;
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

describe('General - GET /me', () => {
  test('Throws 401 without valid id token', async () => {
    await request
      .get('/me')
      .query({ id_token: 'foo' })
      .expect(HTTP_UNAUTHORIZED);
  });

  test('Throws 400 without id token', async () => {
    await request.get('/me').expect(HTTP_BAD_REQUEST);
  });

  test('Throws 403 if not registered', async () => {
    const idToken = await firebaseCustomIdToken('test');

    await request
      .get('/me')
      .query({ id_token: idToken })
      .expect(HTTP_FORBIDDEN);
  });

  test('Correctly returns the user info of given token, and also updates last_signed_at', async () => {
    const idToken = await firebaseCustomIdToken('test');

    const registerResponse = await request
      .post('/register')
      .query({ id_token: idToken })
      .send({ profile: { name: 'foo' } })
      .expect(HTTP_CREATED);

    const { user } = registerResponse.body as {
      user: {
        id: string;
        userProfileId: string;
        policyId: string;
        state: string;
        provider: string;
        providerUserId: string;
      };
    };

    const response = await request
      .get('/me')
      .query({ id_token: idToken })
      .expect(HTTP_OK);

    const { user: fetchedUser } = response.body as {
      user: {
        id: string;
        userProfileId: string;
        policyId: string;
        state: string;
        provider: string;
        providerUserId: string;
      };
    };

    expect(user.id).toBe(fetchedUser.id);
    expect(user.userProfileId).toBe(fetchedUser.userProfileId);
    expect(user.policyId).toBe(fetchedUser.policyId);
    expect(user.state).toBe(fetchedUser.state);
    expect(user.provider).toBe(fetchedUser.provider);
    expect(user.providerUserId).toBe(fetchedUser.providerUserId);

    const userFromDatabase = await getRepository(User).findOne(fetchedUser.id);
    expect(userFromDatabase?.lastSignedAt).toBeTruthy();
  });
});

describe('Overriding with root user', () => {
  test('Can override own policy as root user', async () => {
    const testUid = await setupUser();

    process.env.ROOT_UID = testUid;

    await request
      .get('/policy/count')
      .set({ 'x-debug-user-id': testUid })
      .expect(HTTP_OK);
  });

  test('Cannot override policy when ROOT_UID is given different', async () => {
    const testUid = await setupUser();

    process.env.ROOT_UID = uuid.v4();

    await request
      .get('/policy/count')
      .set({ 'x-debug-user-id': testUid })
      .expect(HTTP_FORBIDDEN);
  });

  test('Prints logs when acting as root user', async () => {
    const testUid = await setupUser();

    process.env.ROOT_UID = testUid;

    await request.get('/policy/count').set({ 'x-debug-user-id': testUid });

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(`user ${testUid} executing as root policy`)
    );
  });
});
