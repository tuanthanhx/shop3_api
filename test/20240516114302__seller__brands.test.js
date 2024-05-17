const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');
const db = require('../src/models');

require('dotenv').config();

const api = `/api-seller/${process.env.VERSION}`;

describe('Brands', () => {
  let accessToken = null;

  beforeAll(async () => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');

    await db.brand.destroy({
      where: {
        name: 'Test-0001',
      },
    });
  });

  it('GET /brands - Success', async () => {
    const response = await request(app)
      .get(`${api}/brands`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('POST /brands - Success', async () => {
    const response = await request(app)
      .post(`${api}/brands`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test-0001',
        description: 'dummy',
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /brands - Duplicated name', async () => {
    const response = await request(app)
      .post(`${api}/brands`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test-0001',
        description: 'dummy',
      });
    expect(response.statusCode).toBe(409);
  });

  it('POST /brands - Empty name', async () => {
    const response = await request(app)
      .post(`${api}/brands`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
        description: 'dummy',
      });
    expect(response.statusCode).toBe(400);
  });
});
