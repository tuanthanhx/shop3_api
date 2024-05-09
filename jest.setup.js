const { startServer, closeServer } = require('./server');

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await closeServer(server);
});
