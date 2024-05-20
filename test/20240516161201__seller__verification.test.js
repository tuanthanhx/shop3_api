const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');
const db = require('../src/models');

require('dotenv').config();

const api = `/api-seller/${process.env.VERSION}`;

describe('Seller Verification', () => {
  let accessToken = null;

  beforeAll(async () => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_phone.txt'), 'utf8');

    await db.shop.destroy({
      where: {
        shopName: 'Test Shop 2',
      },
    });
  });

  it('POST /sellers/verification - Success', async () => {
    const response = await request(app)
      .post(`${api}/sellers/verification`)
      .set('Content-Type', 'multipart/form-data')
      .field('businessType', '1')
      .field('shopName', 'Test Shop 2')
      .field('useCurrentEmail', 'true')
      .field('useCurrentPhone', 'true')
      .attach('householdBusinessRegistrationDocument1', path.resolve(__dirname, 'files/cute_01.jpg'))
      .attach('householdBusinessRegistrationDocument2', path.resolve(__dirname, 'files/cute_02.jpg'))
      .attach('householdBusinessRegistrationDocument3', path.resolve(__dirname, 'files/cute_03.jpg'))
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('PUT /sellers/verification - Success', async () => {
    const response = await request(app)
      .put(`${api}/sellers/verification`)
      .set('Content-Type', 'multipart/form-data')
      .field('businessType', '1')
      .field('shopName', 'Test Shop 2')
      .field('useCurrentEmail', 'true')
      .field('useCurrentPhone', 'true')
      .attach('householdBusinessRegistrationDocument1', path.resolve(__dirname, 'files/cute_01.jpg'))
      .attach('householdBusinessRegistrationDocument2', path.resolve(__dirname, 'files/cute_02.jpg'))
      .attach('householdBusinessRegistrationDocument3', path.resolve(__dirname, 'files/cute_03.jpg'))
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('GET /sellers/verification - Success', async () => {
    const response = await request(app)
      .get(`${api}/sellers/verification`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
