const request = require('supertest');
const { app, startServer, closeServer } = require('../server');

require('dotenv').config();

let server;
const api = `/api/${process.env.VERSION}`;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await closeServer(server);
});

describe('Register by Email', () => {
  it('Success', async () => {
    const body = {
      email: 'incrxi@gmail.com',
      password: 'xxxxxx',
      passwordConfirm: 'xxxxxx',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/email`).send(body);
    expect(response.statusCode).toBe(200, `Expected statusCode to be 200, but got ${response.statusCode}`);
  });
});
