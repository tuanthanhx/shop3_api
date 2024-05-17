const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-seller/${process.env.VERSION}`;

describe('Categories', () => {
  let accessToken = null;

  beforeAll(() => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');
  });

  it('GET /categories', async () => {
    const response = await request(app)
      .get(`${api}/categories`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('GET /categories/1/attributes', async () => {
    const response = await request(app)
      .get(`${api}/categories/1/attributes`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
