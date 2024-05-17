const request = require('supertest');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-common/${process.env.VERSION}`;

describe('Auth / Reset Password (Email)', () => {
  it('POST /auth/reset_password/email -- Success', async () => {
    const response = await request(app)
      .post(`${api}/auth/reset_password/email`)
      .send({
        email: 'test-user@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
        verificationCode: '000000',
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /auth/reset_password/email -- Wrong email', async () => {
    const response = await request(app)
      .post(`${api}/auth/reset_password/email`)
      .send({
        email: 'xxxxxxxx@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
        verificationCode: '000000',
      });
    expect(response.statusCode).toBe(404);
  });

  it('POST /auth/reset_password/email -- Invalid OTP', async () => {
    const response = await request(app)
      .post(`${api}/auth/reset_password/email`)
      .send({
        email: 'test-user@gmail.com',
        password: '123456',
        passwordConfirm: '123456',
        verificationCode: 'xxxxxx',
      });
    expect(response.statusCode).toBe(400);
  });

  it('POST /auth/reset_password/email -- Invalid Confirm Password', async () => {
    const response = await request(app)
      .post(`${api}/auth/reset_password/email`)
      .send({
        email: 'test-user@gmail.com',
        password: '123456',
        passwordConfirm: 'xxxxxx',
        verificationCode: '000000',
      });
    expect(response.statusCode).toBe(400);
  });
});

describe('Auth / Reset Password (Phone)', () => {
  it('POST /auth/reset_password/phone -- Success', async () => {
    const response = await request(app)
      .post(`${api}/auth/reset_password/phone`)
      .send({
        phone: '0399111111',
        password: '123456',
        passwordConfirm: '123456',
        verificationCode: '000000',
      });
    expect(response.statusCode).toBe(200);
  });
});
