const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-common/${process.env.VERSION}`;

describe('Currencies', () => {
  let accessToken = null;

  beforeAll(() => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');
  });

  it('Get /currencies', async () => {
    const response = await request(app)
      .get(`${api}/currencies`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
