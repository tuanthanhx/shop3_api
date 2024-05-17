const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../server');
// const db = require('../src/models');

require('dotenv').config();

const api = `/api-common/${process.env.VERSION}`;

describe('Authentication with Email', () => {
  let accessToken = null;
  let refreshToken = null;

  beforeAll(() => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), 'utf8');
    refreshToken = fs.readFileSync(path.resolve(__dirname, 'setup/refresh_token_email.txt'), 'utf8');
  });

  it('POST /auth/logout -- Success', async () => {
    const response = await request(app)
      .post(`${api}/auth/logout`);
    expect(response.statusCode).toBe(204);
  });

  it('POST /auth/logout -- Success with accessToken', async () => {
    const response = await request(app)
      .post(`${api}/auth/logout`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(204);
  });

  it('POST /auth/login/email -- Success', async () => {
    const response = await request(app)
      .post(`${api}/auth/login/email`)
      .send({
        email: 'test-user@gmail.com',
        password: '123456',
      });
    expect(response.statusCode).toBe(200);

    // Re-assign tokens because the previous tokens are revoked
    const newAccessToken = response?.body?.data?.accessToken;
    const newRefreshToken = response?.body?.data?.refreshToken;
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    fs.writeFileSync(path.resolve(__dirname, 'setup/access_token_email.txt'), newAccessToken);
    fs.writeFileSync(path.resolve(__dirname, 'setup/refresh_token_email.txt'), newRefreshToken);
  });

  it('POST /auth/login/email -- Wrong Email', async () => {
    const response = await request(app)
      .post(`${api}/auth/login/email`)
      .send({
        email: 'test-user-xxxxxxx@gmail.com',
        password: '123456',
      });
    expect(response.statusCode).toBe(401);
  });

  it('POST /auth/login/email -- Wrong Password', async () => {
    const response = await request(app)
      .post(`${api}/auth/login/email`)
      .send({
        email: 'test-user@gmail.com',
        password: 'xxxxxxxxx',
      });
    expect(response.statusCode).toBe(401);
  });

  it('GET /auth/is_login -- Success', async () => {
    const response = await request(app)
      .get(`${api}/auth/is_login`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('GET /auth/me -- Success', async () => {
    const response = await request(app)
      .get(`${api}/auth/me`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  it('POST /auth/refresh_token -- Success', async () => {
    const response = await request(app)
      .post(`${api}/auth/refresh_token`)
      .send({
        refreshToken,
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /auth/refresh_token -- Invalid Refresh Token', async () => {
    const response = await request(app)
      .post(`${api}/auth/refresh_token`)
      .send({
        refreshToken: 'xxxxxx',
      });
    expect(response.statusCode).toBe(401);
  });
});

describe('Authentication with Phone', () => {
  let accessToken = null;
  let refreshToken = null;

  beforeAll(() => {
    accessToken = fs.readFileSync(path.resolve(__dirname, 'setup/access_token_phone.txt'), 'utf8');
    refreshToken = fs.readFileSync(path.resolve(__dirname, 'setup/refresh_token_phone.txt'), 'utf8');
  });

  it('POST /auth/login/phone -- Success', async () => {
    const response = await request(app)
      .post(`${api}/auth/login/phone`)
      .send({
        phone: '0399111111',
        password: '123456',
      });
    expect(response.statusCode).toBe(200);

    // Re-assign tokens because the previous tokens are revoked
    const newAccessToken = response?.body?.data?.accessToken;
    const newRefreshToken = response?.body?.data?.refreshToken;
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    fs.writeFileSync(path.resolve(__dirname, 'setup/access_token_phone.txt'), newAccessToken);
    fs.writeFileSync(path.resolve(__dirname, 'setup/refresh_token_phone.txt'), newRefreshToken);
  });

  it('POST /auth/login/phone -- Wrong Password', async () => {
    const response = await request(app)
      .post(`${api}/auth/login/phone`)
      .send({
        phone: '0399111111',
        password: 'xxxxxxxxx',
      });
    expect(response.statusCode).toBe(401);
  });
});
