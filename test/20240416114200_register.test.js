const request = require('supertest');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-common/${process.env.VERSION}`;

describe('Register by Email', () => {
  it('Success', async () => {
    const body = {
      email: 'incrxi-test-300@gmail.com',
      password: 'xxxxxx',
      passwordConfirm: 'xxxxxx',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/email`).send(body);
    expect(response.statusCode).toBe(200, `Expected statusCode to be 200, but got ${response.statusCode}`);
  });
});
