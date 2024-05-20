const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-seller/${process.env.VERSION}`;

describe('Business Types', () => {
  let accessToken = null;

  beforeAll(async () => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');
  });

  it('GET /sellers/business_types - Success', async () => {
    const response = await request(app)
      .get(`${api}/sellers/business_types`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
