const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');
// const db = require('../src/models');

require('dotenv').config();

const api = `/api-seller/${process.env.VERSION}`;

describe('Logistics Services', () => {
  let accessToken = null;

  beforeAll(async () => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');
  });

  it('GET /sellers/logistics_services - Success', async () => {
    const response = await request(app)
      .get(`${api}/sellers/logistics_services`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('POST /sellers/logistics_services/subscribe - Success', async () => {
    const response = await request(app)
      .post(`${api}/sellers/logistics_services/subscribe`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        serviceId: 1,
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /sellers/logistics_services/subscribe - Wrong serviceId', async () => {
    const response = await request(app)
      .post(`${api}/sellers/logistics_services/subscribe`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        serviceId: 1000,
      });
    expect(response.statusCode).toBe(404);
  });

  it('POST /sellers/logistics_services/unsubscribe - Success', async () => {
    const response = await request(app)
      .post(`${api}/sellers/logistics_services/unsubscribe`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        serviceId: 1,
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /sellers/logistics_services/unsubscribe - Wrong serviceId', async () => {
    const response = await request(app)
      .post(`${api}/sellers/logistics_services/unsubscribe`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        serviceId: 1000,
      });
    expect(response.statusCode).toBe(404);
  });

  it('POST /sellers/logistics_services/estimate_shipping_fee - Success', async () => {
    const response = await request(app)
      .post(`${api}/sellers/logistics_services/estimate_shipping_fee`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        serviceId: 1,
        weight: 1000,
        width: 20,
        height: 20,
        length: 20,
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /sellers/logistics_services/estimate_shipping_fee - Without weight', async () => {
    const response = await request(app)
      .post(`${api}/sellers/logistics_services/estimate_shipping_fee`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        serviceId: 1,
        width: 20,
        height: 20,
        length: 20,
      });
    expect(response.statusCode).toBe(400);
  });
});
