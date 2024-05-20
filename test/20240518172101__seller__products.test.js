const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');
const db = require('../src/models');

require('dotenv').config();

const api = `/api-seller/${process.env.VERSION}`;

describe('Products', () => {
  let accessToken = null;
  let productId = null;

  beforeAll(async () => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');
  });

  it('GET /products - Success', async () => {
    const response = await request(app)
      .get(`${api}/products`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('POST /products - Success', async () => {
    const response = await request(app)
      .post(`${api}/products`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Product 001',
        description: 'Lorem ipsum',
        categoryId: 1,
        productStatusId: 5,
        brandId: 1,
        images: [
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288107052426_cute_01.jpg',
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288135066084_cute_02.jpg',
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288148187599_cute_03.jpg',
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288140612247_cute_04.jpg',
        ],
        video: 'https://storage.googleapis.com/media-bucket-dev/public/product/videos/17138584443770356809_3209828-uhd_3840_2160_25fps.mp4',
        packageWeight: 100,
        packageWidth: 100,
        packageHeight: 100,
        packageLength: 100,
        logisticsServiceIds: [
          1,
          2,
        ],
        cod: true,
        attributes: [
          {
            name: 'Season',
            value: 'Spring',
          },
          {
            name: 'Care Instructions',
            value: [
              'Hand Wash',
              'Dry Clean',
            ],
          },
          {
            name: 'Clothing Length',
            value: [
              'Short',
              'Medium',
            ],
          },
        ],
        variants: [
          {
            name: 'Default',
            options: [
              {
                name: 'Default',
              },
            ],
          },
        ],
        productVariants: [
          {
            options: [
              {
                name: 'Default',
                value: 'Default',
              },
            ],
            price: 101,
            sku: 'SKU001',
            quantity: 51,
          },
        ],
      });

    const product = await db.product.findOne({
      where: { name: 'Test Product 001' },
    });
    productId = product?.id;

    expect(response.statusCode).toBe(201);
  });

  it('PUT /products/:id - Success', async () => {
    const response = await request(app)
      .put(`${api}/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Product 001',
        description: 'Lorem ipsum 2',
        categoryId: 1,
        productStatusId: 5,
        brandId: 1,
        images: [
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288107052426_cute_01.jpg',
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288135066084_cute_02.jpg',
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288148187599_cute_03.jpg',
          'https://storage.googleapis.com/media-bucket-dev/public/product/images/17138566288140612247_cute_04.jpg',
        ],
        video: 'https://storage.googleapis.com/media-bucket-dev/public/product/videos/17138584443770356809_3209828-uhd_3840_2160_25fps.mp4',
        packageWeight: 100,
        packageWidth: 100,
        packageHeight: 100,
        packageLength: 100,
        logisticsServiceIds: [
          1,
          2,
        ],
        cod: true,
        attributes: [
          {
            name: 'Season',
            value: 'Spring',
          },
          {
            name: 'Care Instructions',
            value: [
              'Hand Wash',
              'Dry Clean',
            ],
          },
          {
            name: 'Clothing Length',
            value: [
              'Short',
              'Medium',
            ],
          },
        ],
        variants: [
          {
            name: 'Default',
            options: [
              {
                name: 'Default',
              },
            ],
          },
        ],
        productVariants: [
          {
            options: [
              {
                name: 'Default',
                value: 'Default',
              },
            ],
            price: 101,
            sku: 'SKU001',
            quantity: 51,
          },
        ],
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /products/bulk_activate - Success', async () => {
    const response = await request(app)
      .post(`${api}/products/bulk_activate`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ids: [productId],
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /products/bulk_deactivate - Success', async () => {
    const response = await request(app)
      .post(`${api}/products/bulk_deactivate`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ids: [productId],
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /products/bulk_delete - Success', async () => {
    const response = await request(app)
      .post(`${api}/products/bulk_delete`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ids: [productId],
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /products/bulk_recover - Success', async () => {
    const response = await request(app)
      .post(`${api}/products/bulk_recover`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ids: [productId],
      });
    expect(response.statusCode).toBe(200);
  });

  it('DELETE /products/:id - Success', async () => {
    const response = await request(app)
      .delete(`${api}/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });
});
