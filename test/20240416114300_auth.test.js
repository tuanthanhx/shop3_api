const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');
// const db = require('../src/models');

require('dotenv').config();

const api = `/api-common/${process.env.VERSION}`;

describe('User Authentication Flow', () => {
  let accessToken = null;

  beforeAll(() => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/token.txt'), 'utf8');
  });

  it('Get /auth/is_login', async () => {
    const response = await request(app)
      .get(`${api}/auth/is_login`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('Get /auth/me', async () => {
    const response = await request(app)
      .get(`${api}/auth/me`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
