import { Connection, ConnectionOptions } from 'typeorm';
import entities from '../entities';

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
    name: 'http-api-template',
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
    name: `http-api-worker_${workerId}`,
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
