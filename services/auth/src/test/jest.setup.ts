import { createConnection } from 'typeorm';
import { ormConfigs, templateDbName, workerDbName } from '.';
import { env } from '../util';

const setup = async () => {
  const connection = await createConnection(ormConfigs.master());

  const numWorkers = parseInt(env('JEST_WORKERS') ?? '1', 10);

  /* setup template database */
  await connection.query(`DROP DATABASE IF EXISTS ${templateDbName()}`);
  await connection.query(`CREATE DATABASE ${templateDbName()}`);

  const templateDbConnection = await createConnection(ormConfigs.template());
  await templateDbConnection.close();

  /* generate databases for each workers */
  await Promise.all(
    [...Array(numWorkers).keys()]
      .map((i) => workerDbName(i + 1))
      .map(async (dbName) => {
        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
        await connection.query(
          `CREATE DATABASE ${dbName} TEMPLATE ${templateDbName()}`
        );
      })
  );

  await connection.close();
};

export default setup;
