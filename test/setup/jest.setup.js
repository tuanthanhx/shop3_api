const { startServer, closeServer } = require('../../server');

let server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await closeServer(server);
});
