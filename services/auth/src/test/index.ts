import supertest from 'supertest';
import { Connection, ConnectionOptions, getConnection } from 'typeorm';
import app from '../app';
import entities from '../entities';
import { KoaServer } from '../types/koa';
import { env } from '../util';

export const templateDbName = () => `test_template`;
export const workerDbName = (workerId: number) => `test_${workerId}`;

export const ormConfigs: {
  master: () => ConnectionOptions;
  template: () => ConnectionOptions;
  worker: (workerId: number) => ConnectionOptions;
  testServer: (workerId: number) => ConnectionOptions;
} = {
  master: () => ({
    type: 'postgres',
    host: 'localhost',
    port: 5000,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
  }),
  template: () => ({
    name: 'template',
    type: 'postgres',
    host: 'localhost',
    port: 5000,
    username: 'postgres',
    password: 'postgres',
    database: templateDbName(),
    synchronize: true,
    entities,
  }),
  worker: (workerId: number) => ({
    name: `worker_${workerId}`,
    type: 'postgres',
    host: 'localhost',
    port: 5000,
    username: 'postgres',
    password: 'postgres',
    database: workerDbName(workerId),
    entities,
  }),
  testServer: (workerId: number) => ({
    type: 'postgres',
    host: 'localhost',
    port: 5000,
    username: 'postgres',
    password: 'postgres',
    database: workerDbName(workerId),
  }),
};

export const cleanDatabase = async (connection: Connection) => {
  const queryRunner = connection.createQueryRunner();

  await queryRunner.query(`
    DO
    $func$
    BEGIN
      EXECUTE (
        SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
          FROM pg_class
          WHERE relkind = 'r'
          AND relnamespace = 'public'::regnamespace
      );
    END
    $func$;
  `);

  await queryRunner.release();
};

export const openServer = () => {
  const basePort = parseInt(env('TEST_SERVER_BASE_PORT'), 10);
  const workerId = parseInt(env('JEST_WORKER_ID'), 10);
  const port = basePort + workerId;

  const ormConfig = ormConfigs.testServer(workerId);
  process.env.TEST_ORMCONFIG = JSON.stringify(ormConfig);

  const server = app.listen(port);
  const request = supertest(server);

  return { server, request };
};

export const closeServer = async (server?: KoaServer) => {
  server?.close();

  try {
    const connection = getConnection();
    await connection?.close();
  } catch (e) {
    /* pass */
  }
};
