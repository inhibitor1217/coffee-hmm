import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import { HTTP_OK } from '../const';
import { buildString } from '../util';

// eslint-disable-next-line no-console
console.log = jest.fn(); /* disable dev server console output */

let server: ReturnType<typeof app.listen>;
let request: SuperTest<Test>;

beforeAll(() => {
  server = app.listen(7007);
  request = supertest(server);
});

describe('Heartbeat', () => {
  test('Server is alive and responding', async () => {
    const response = await request.get('/').expect(HTTP_OK);
    expect(response.body).toEqual({ msg: `${buildString()} is alive!` });
  });
});

afterAll(() => {
  server.close();
});
