import { createConnection } from 'typeorm';
import { ormConfigs, templateDbName, workerDbName } from '.';
import { env } from '../util';

const teardown = async () => {
  const connection = await createConnection(ormConfigs.master());

  const numWorkers = parseInt(env('JEST_WORKERS') ?? '1', 10);

  await connection.query(`DROP DATABASE IF EXISTS ${templateDbName()}`);
  await Promise.all(
    [...Array(numWorkers).keys()]
      .map((i) => workerDbName(i + 1))
      .map(async (dbName) => {
        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
      })
  );

  await connection.close();
};

export default teardown;
