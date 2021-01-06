import pLimit from 'p-limit';
import { SuperTest, Test } from 'supertest';
import { Connection, createConnection, DeepPartial } from 'typeorm';
import * as uuid from 'uuid';
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from '../../const';
import Policy from '../../entities/policy';
import User, { AuthProvider, UserState } from '../../entities/user';
import UserProfile from '../../entities/userProfile';
import { cleanDatabase, closeServer, openServer, ormConfigs } from '../../test';
import { KoaServer } from '../../types/koa';
import { env } from '../../util';
import {
  IamPolicy,
  IamPolicyObject,
  IamRule,
  OperationType,
} from '../../util/iam';

let connection: Connection;
let server: KoaServer;
let request: SuperTest<Test>;

let testPolicyIds: string[];
let adminUid: string;

jest.setTimeout(30000);
// eslint-disable-next-line no-console
console.log = jest.fn();

const testPolicyString = JSON.stringify(
  new IamPolicy({
    rules: [
      new IamRule({ operationType: OperationType.query, operation: 'auth.*' }),
    ],
  }).toJsonObject()
);
const adminerPolicyString = JSON.stringify(
  new IamPolicy({
    rules: [
      new IamRule({ operationType: OperationType.query, operation: '*' }),
      new IamRule({ operationType: OperationType.mutation, operation: '*' }),
    ],
  }).toJsonObject()
);

const NUM_TEST_POLICIES = 150;
const setupPolicies = async () => {
  const throttle = pLimit(16);
  const policies = await Promise.all(
    [...Array(NUM_TEST_POLICIES).keys()]
      .map((i) => () => {
        return connection
          .createQueryBuilder(Policy, 'policy')
          .insert()
          .values({
            name: `policy_${i.toString().padStart(3, '0')}`,
            value: testPolicyString,
          })
          .returning(Policy.columns)
          .execute()
          .then((insertResult) =>
            Policy.fromRawColumns(
              (insertResult.raw as DeepPartial<Policy>[])[0],
              {
                connection,
              }
            )
          );
      })
      .map((task) => throttle(task))
  );
  return policies.map((policy) => policy.id);
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

  testPolicyIds = await setupPolicies();
  adminUid = await setupAdminer();
});

afterAll(async () => {
  await connection?.close();
  await closeServer(server);
});

describe('Policy - POST /policy', () => {
  test('Successfully creates policy', async () => {
    const newPolicy = new IamPolicy({
      rules: [
        new IamRule({ operationType: OperationType.query, operation: '*' }),
      ],
    });

    const response = await request
      .post('/policy')
      .set({ 'x-debug-user-id': adminUid })
      .send({
        name: 'BrandNewPolicy',
        value: JSON.stringify(newPolicy.toJsonObject()),
      })
      .expect(HTTP_CREATED);

    const {
      policy: { name, value, rules },
    } = response.body as {
      policy: { name: string; value: string } & IamPolicyObject;
    };
    expect(name).toBe('BrandNewPolicy');
    expect(value).toBe(JSON.stringify(newPolicy.toJsonObject()));
    expect({ rules }).toEqual(newPolicy.toJsonObject());
  });

  test('Throws 400 if invalid policy string is given', async () => {
    const newPolicy = new IamPolicy({
      rules: [
        new IamRule({ operationType: OperationType.query, operation: '*' }),
      ],
    });

    await request
      .post('/policy')
      .set({ 'x-debug-user-id': adminUid })
      .send({
        name: 'AnotherPolicy',
        value: JSON.stringify(newPolicy.toJsonObject()).slice(1),
      })
      .expect(HTTP_BAD_REQUEST);
  });
});

describe('Policy - GET /policy/:policyId', () => {
  test('Successfully loads a policy', async () => {
    const response = await request
      .get(`/policy/${testPolicyIds[42]}`)
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_OK);

    const {
      policy: { id, name, value, rules },
    } = response.body as {
      policy: { id: string; name: string; value: string } & IamPolicyObject;
    };
    expect(id).toBe(testPolicyIds[42]);
    expect(name).toBe(`policy_042`);
    expect(value).toBe(testPolicyString);
    expect({ rules }).toEqual(
      new IamPolicy({
        rules: [
          new IamRule({
            operationType: OperationType.query,
            operation: 'auth.*',
          }),
        ],
      }).toJsonObject()
    );
  });

  test('Throws 404 if not found', async () => {
    await request
      .get(`/policy/${uuid.v4()}`)
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_NOT_FOUND);
  });
});

describe('Policy - GET /policy/count', () => {
  test('Should equal to num of policies', async () => {
    const response = await request
      .get('/policy/count')
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_OK);
    const {
      policy: { count },
    } = response.body as { policy: { count: number } };
    expect(count).toBe(NUM_TEST_POLICIES + 2);
  });
});

type SimplePolicy = {
  id: string;
  updatedAt: string;
  name: string;
};
const sweepPolicies = async (orderBy: string, order?: string) => {
  async function recursiveSweep(
    policies: SimplePolicy[],
    cursor?: string
  ): Promise<SimplePolicy[]> {
    const response = await request
      .get('/policy/list')
      .set({ 'x-debug-user-id': adminUid })
      .query({ limit: 7, cursor, orderBy, order })
      .expect(HTTP_OK);

    const {
      policy: { list },
      cursor: nextCursor,
    } = response.body as { policy: { list: SimplePolicy[] }; cursor: string };
    expect(list.length).toBeLessThanOrEqual(7);

    const merged = [...policies, ...list];
    if (!nextCursor) {
      return merged;
    }

    return recursiveSweep(merged, nextCursor);
  }

  return recursiveSweep([]);
};

describe('Policy - GET /policy/list', () => {
  test('Can list all policies: order by updatedAt descending', async () => {
    const policies = await sweepPolicies('updatedAt', 'desc');

    expect(policies.length).toBe(NUM_TEST_POLICIES + 2);
    const updatedAts = policies.map((policy) => Date.parse(policy.updatedAt));
    for (let i = 0; i < updatedAts.length - 1; i += 1) {
      expect(updatedAts[i]).toBeGreaterThanOrEqual(updatedAts[i + 1]);
    }
  });

  test('Can list all policies: order by name ascending', async () => {
    const policies = await sweepPolicies('name');

    expect(policies.length).toBe(NUM_TEST_POLICIES + 2);
    const names = policies.map((policy) => policy.name);
    for (let i = 0; i < names.length - 1; i += 1) {
      expect(names[i] <= names[i + 1]).toBe(true);
    }
  });
});

describe('Policy - PUT /policy/:policyId', () => {
  test('Can update policy name', async () => {
    const response = await request
      .put(`/policy/${testPolicyIds[128]}`)
      .set({ 'x-debug-user-id': adminUid })
      .send({ name: 'NewPolicy' })
      .expect(HTTP_OK);

    const {
      policy: { id, name, value },
    } = response.body as {
      policy: { id: string; name: string; value: string };
    };
    expect(id).toBe(testPolicyIds[128]);
    expect(name).toBe('NewPolicy');
    expect(value).toBe(testPolicyString);

    const policy = await connection
      .getRepository(Policy)
      .findOne(testPolicyIds[128]);
    expect(policy?.name).toBe('NewPolicy');
  });

  test('Can update policy value', async () => {
    const newPolicy = new IamPolicy({
      rules: [
        new IamRule({
          operationType: OperationType.mutation,
          operation: 'auth.user.*',
        }),
        new IamRule({
          operationType: OperationType.query,
          operation: 'auth.user.profile',
        }),
      ],
    });

    const response = await request
      .put(`/policy/${testPolicyIds[129]}`)
      .set({ 'x-debug-user-id': adminUid })
      .send({ value: JSON.stringify(newPolicy.toJsonObject()) })
      .expect(HTTP_OK);

    const {
      policy: { id, name, rules },
    } = response.body as {
      policy: { id: string; name: string } & IamPolicyObject;
    };
    expect(id).toBe(testPolicyIds[129]);
    expect(name).toBe('policy_129');
    expect({ rules }).toEqual(newPolicy.toJsonObject());

    const policy = await connection
      .getRepository(Policy)
      .findOne(testPolicyIds[129]);
    expect(policy?.value).toBe(JSON.stringify(newPolicy.toJsonObject()));
  });

  test('Throws 400 if invalid policy string is given', async () => {
    const newPolicy = new IamPolicy({
      rules: [
        new IamRule({
          operationType: OperationType.mutation,
          operation: 'auth.user.*',
        }),
        new IamRule({
          operationType: OperationType.query,
          operation: 'auth.user.profile',
        }),
      ],
    });

    await request
      .put(`/policy/${testPolicyIds[129]}`)
      .set({ 'x-debug-user-id': adminUid })
      .send({ value: JSON.stringify(newPolicy.toJsonObject()).slice(1) })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if not found', async () => {
    await request
      .put(`/policy/${uuid.v4()}`)
      .set({ 'x-debug-user-id': adminUid })
      .send({ name: 'NewPolicy' })
      .expect(HTTP_NOT_FOUND);
  });
});

describe('Policy - DELETE /policy/:policyId', () => {
  test('Can hard delete policy', async () => {
    const response = await request
      .delete(`/policy/${testPolicyIds[16]}`)
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_OK);

    const {
      policy: { id },
    } = response.body as { policy: { id: string } };
    expect(id).toBe(testPolicyIds[16]);

    const policy = await connection
      .getRepository(Policy)
      .findOne(testPolicyIds[16]);
    expect(policy).toBeFalsy();
  });

  test('Throws 400 if some user is using this policy', async () => {
    const adminerPolicy = await connection
      .getRepository(Policy)
      .findOne({ where: { name: 'AdminerPolicy' } });

    if (!adminerPolicy) {
      throw Error();
    }

    await request
      .delete(`/policy/${adminerPolicy.id}`)
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_BAD_REQUEST);
  });

  test('Throws 404 if not found', async () => {
    await request
      .delete(`/policy/${uuid.v4()}`)
      .set({ 'x-debug-user-id': adminUid })
      .expect(HTTP_NOT_FOUND);
  });
});
