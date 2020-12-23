import pLimit from 'p-limit';
import { SuperTest, Test } from 'supertest';
import { Connection, createConnection, DeepPartial } from 'typeorm';
import * as uuid from 'uuid';
import { HTTP_FORBIDDEN, HTTP_NOT_FOUND, HTTP_OK } from '../../const';
import Policy, { DEFAULT_USER_POLICY_NAME } from '../../entities/policy';
import User, {
  AuthProvider,
  AuthProviderStrings,
  UserState,
  UserStateStrings,
} from '../../entities/user';
import UserProfile from '../../entities/userProfile';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../../test';
import { firebaseCustomIdToken } from '../../test/util';
import { KoaServer } from '../../types/koa';
import { env } from '../../util';
import {
  generateDefaultUserPolicy,
  IamPolicy,
  IamPolicyObject,
  IamRule,
  OperationType,
} from '../../util/iam';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

let testUids: string[];
let adminUid: string;

jest.setTimeout(30000);
// eslint-disable-next-line no-console
console.log = jest.fn();

const defaultUserPolicyString = JSON.stringify(
  generateDefaultUserPolicy().toJsonObject()
);
const adminerPolicyString = JSON.stringify(
  new IamPolicy({
    rules: [
      new IamRule({
        operationType: OperationType.query,
        operation: '*',
      }),
      new IamRule({
        operationType: OperationType.mutation,
        operation: '*',
      }),
    ],
  }).toJsonObject()
);

const NUM_TEST_USERS = 200;
const setupUsers = async () => {
  const throttle = pLimit(16);

  const defaultUserPolicy = await connection
    .createQueryBuilder(Policy, 'policy')
    .insert()
    .values({
      name: DEFAULT_USER_POLICY_NAME,
      value: defaultUserPolicyString,
    })
    .returning(Policy.columns)
    .execute()
    .then((insertResult) =>
      Policy.fromRawColumns((insertResult.raw as DeepPartial<Policy>[])[0], {
        connection,
      })
    );

  const uids = await Promise.all(
    [...Array(NUM_TEST_USERS).keys()]
      .map((i) => () => {
        return connection.transaction(async (manager) => {
          const userProfile = await manager
            .createQueryBuilder(UserProfile, 'user_profile')
            .insert()
            .values({ name: `user_${i.toString().padStart(3, '0')}` })
            .returning(UserProfile.columns)
            .execute()
            .then((insertResult) =>
              UserProfile.fromRawColumns(
                (insertResult.raw as DeepPartial<UserProfile>[])[0],
                { connection }
              )
            );

          const user = await manager
            .createQueryBuilder(User, 'user')
            .insert()
            .values({
              fkUserProfileId: userProfile.id,
              fkPolicyId: defaultUserPolicy.id,
              state: UserState.active,
              provider: AuthProvider.custom,
              providerUserId: `test_${i.toString().padStart(3, '0')}`,
            })
            .returning(User.columns)
            .execute()
            .then((insertResult) =>
              User.fromRawColumns(
                (insertResult.raw as DeepPartial<User>[])[0],
                { connection }
              )
            );

          return user.id;
        });
      })
      .map((task) => throttle(task))
  );

  return uids;
};

const setupAdminer = async () => {
  return connection.transaction(async (manager) => {
    const userProfile = await manager
      .createQueryBuilder(UserProfile, 'user_profile')
      .insert()
      .values({ name: `adminer` })
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
        name: 'AdminerPolicy',
        value: adminerPolicyString,
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
        providerUserId: `adminer`,
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

  await cleanDatabase(connection);
  testUids = await setupUsers();
  adminUid = await setupAdminer();
});

afterAll(async () => {
  await connection?.close();
  await closeServer(server);
});

describe('User - GET /user/:userId', () => {
  test('Successfully loads a user', async () => {
    const response = await request
      .get(`/user/${testUids[0]}`)
      .set({ 'x-debug-user-id': testUids[0] })
      .expect(HTTP_OK);

    const {
      user: { providerUserId },
    } = response.body as { user: { providerUserId: string } };
    expect(providerUserId).toBe(`test_000`);
  });

  test('Cannot load a user without privileges', async () => {
    await request
      .get(`/user/${testUids[1]}`)
      .set({ 'x-debug-user-id': testUids[0] })
      .expect(HTTP_FORBIDDEN);
  });

  test('Throws 404 if not found', async () => {
    await request
      .get(`/user/${uuid.v4()}`)
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_NOT_FOUND);
  });
});

describe('User - GET /user/count', () => {
  test('Should equal num of users', async () => {
    const response = await request
      .get('/user/count')
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_OK);

    const {
      user: { count },
    } = response.body as { user: { count: number } };
    expect(count).toBe(NUM_TEST_USERS + 1); /* test users + admin */
  });
});

type SimpleUser = {
  id: string;
  updatedAt: string;
  policyId: string;
  provider: string;
  state: string;
};
const sweepUsers = async (orderBy: string, order?: string) => {
  async function recursiveSweep(
    users: SimpleUser[],
    cursor?: string
  ): Promise<SimpleUser[]> {
    const response = await request
      .get('/user/list')
      .set({ 'x-debug-user-id': adminUid })
      .query({ limit: 10, cursor, orderBy, order })
      .expect(HTTP_OK);

    const {
      user: { list },
      cursor: nextCursor,
    } = response.body as {
      user: {
        list: SimpleUser[];
      };
      cursor: string;
    };
    expect(list.length).toBeLessThanOrEqual(10);

    const merged = [...users, ...list];
    if (!nextCursor) {
      return merged;
    }

    return recursiveSweep(merged, nextCursor);
  }

  return recursiveSweep([]);
};

describe('User - GET /user/list', () => {
  test('Can list all users: order by updatedAt descending', async () => {
    const users = await sweepUsers('updatedAt', 'desc');

    expect(users.length).toBe(NUM_TEST_USERS + 1);

    const updatedAts = users.map((user) => Date.parse(user.updatedAt));
    for (let i = 0; i < updatedAts.length - 1; i += 1) {
      expect(updatedAts[i]).toBeGreaterThanOrEqual(updatedAts[i + 1]);
    }
  });

  test('Can list all users: order by policy ascending', async () => {
    const users = await sweepUsers('policy');

    expect(users.length).toBe(NUM_TEST_USERS + 1);

    const policyIds = users.map((user) => user.policyId);
    for (let i = 0; i < policyIds.length - 1; i += 1) {
      expect(policyIds[i] <= policyIds[i + 1]).toBe(true);
    }
  });

  test('Can list all users: order by provider descending', async () => {
    const users = await sweepUsers('provider', 'desc');

    expect(users.length).toBe(NUM_TEST_USERS + 1);

    const providers = users.map((user) => user.provider);
    for (let i = 0; i < providers.length - 1; i += 1) {
      const thisProvider = AuthProvider[providers[i] as AuthProviderStrings];
      const nextProvider =
        AuthProvider[providers[i + 1] as AuthProviderStrings];
      expect(thisProvider >= nextProvider).toBe(true);
    }
  });

  test('Can list all users: order by state descending', async () => {
    const users = await sweepUsers('state', 'desc');

    expect(users.length).toBe(NUM_TEST_USERS + 1);

    const states = users.map((user) => user.state);
    for (let i = 0; i < states.length - 1; i += 1) {
      const thisState = UserState[states[i] as UserStateStrings];
      const nextState = UserState[states[i + 1] as UserStateStrings];
      expect(thisState >= nextState).toBe(true);
    }
  });
});

describe('User - PUT /user/:userId/state', () => {
  test("Can update user's state", async () => {
    const response = await request
      .put(`/user/${testUids[10]}/state`)
      .set({ 'x-debug-user-id': testUids[10] })
      .send({ state: 'deleted' })
      .expect(HTTP_OK);

    const {
      user: { state },
    } = response.body as { user: { state: string } };
    expect(state).toBe('deleted');
  });

  test('Cannot retrieve token from deleted user', async () => {
    const idToken = await firebaseCustomIdToken('test_010');

    const response = await request
      .get('/token')
      .query({ id_token: idToken })
      .expect(HTTP_FORBIDDEN);

    expect(response.body).toEqual({
      error: { message: `user ${testUids[10]} is deleted` },
    });
  });
});

describe('User - GET /user/:userId/profile', () => {
  test('Sucessfully loads a user profile', async () => {
    const response = await request
      .get(`/user/${testUids[0]}/profile`)
      .set({ 'x-debug-user-id': testUids[0] })
      .expect(HTTP_OK);

    const {
      user: {
        profile: { name },
      },
    } = response.body as { user: { profile: { name: string } } };
    expect(name).toBe('user_000');
  });

  test('Cannot load profile without privilege', async () => {
    await request
      .get(`/user/${testUids[1]}/profile`)
      .set({ 'x-debug-user-id': testUids[0] })
      .expect(HTTP_FORBIDDEN);
  });
});

describe('User - PUT /user/:userId/profile', () => {
  test("Can edit user's profile", async () => {
    const response = await request
      .put(`/user/${testUids[0]}/profile`)
      .set({ 'x-debug-user-id': testUids[0] })
      .send({ email: 'foo@example.com' })
      .expect(HTTP_OK);

    const {
      user: {
        profile: { name, email },
      },
    } = response.body as {
      user: { profile: { name: string; email?: string } };
    };
    expect(name).toBe('user_000');
    expect(email).toBe('foo@example.com');

    const user = await connection
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where({ id: testUids[0] })
      .getOne();
    expect(user?.profile?.email).toBe('foo@example.com');
  });

  test('Cannot edit without privilege', async () => {
    await request
      .put(`/user/${testUids[1]}/profile`)
      .set({ 'x-debug-user-id': testUids[0] })
      .send({ email: 'foo@example.com' })
      .expect(HTTP_FORBIDDEN);
  });
});

describe('User - PUT /user/:userId/policy', () => {
  test("Successfully loads user's policy", async () => {
    const response = await request
      .get(`/user/${testUids[0]}/policy`)
      .set({ 'x-debug-user-id': testUids[0] })
      .expect(HTTP_OK);

    const {
      user: {
        policy: { rules },
      },
    } = response.body as { user: { policy: IamPolicyObject } };
    expect({ rules }).toEqual(generateDefaultUserPolicy().toJsonObject());
  });
});
