const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-seller/${process.env.VERSION}`;

describe('Media', () => {
  let accessToken = null;

  beforeAll(async () => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');
  });

  it('POST /media/product_images - Success', async () => {
    const response = await request(app)
      .post(`${api}/media/product_images`)
      .set('Content-Type', 'multipart/form-data')
      .attach('files', path.resolve(__dirname, 'files/cute_01.jpg'))
      .attach('files', path.resolve(__dirname, 'files/cute_02.jpg'))
      .attach('files', path.resolve(__dirname, 'files/cute_03.jpg'))
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('POST /media/product_video - Success', async () => {
    const response = await request(app)
      .post(`${api}/media/product_video`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', path.resolve(__dirname, 'files/test.mp4'))
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('POST /media/product_variant_image - Success', async () => {
    const response = await request(app)
      .post(`${api}/media/product_variant_image`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', path.resolve(__dirname, 'files/cute_01.jpg'))
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
