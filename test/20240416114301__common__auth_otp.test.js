const request = require('supertest');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-common/${process.env.VERSION}`;

describe('Auth / Generate OTP', () => {
  // TODO: Temporary disable this to prevent spam notification
  // it('POST /auth/generate_otp/email -- valid email', async () => {
  //   const response = await request(app)
  //     .post(`${api}/auth/generate_otp/email`)
  //     .send({
  //       email: 'incrxi@gmail.com', // Must be this real email
  //     });
  //   expect(response.statusCode).toBe(200);
  // });

  it('POST /auth/generate_otp/email -- invalid email', async () => {
    const response = await request(app)
      .post(`${api}/auth/generate_otp/email`)
      .send({
        email: 'xxxxxxxxxxxxxx',
      });
    expect(response.statusCode).toBe(400);
  });

  it('POST /auth/generate_otp/phone -- valid phone', async () => {
    const response = await request(app)
      .post(`${api}/auth/generate_otp/phone`)
      .send({
        phone: '0399999999',
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /auth/generate_otp/phone -- invalid (empty) phone', async () => {
    const response = await request(app)
      .post(`${api}/auth/generate_otp/phone`)
      .send({
        phone: '',
      });
    expect(response.statusCode).toBe(400);
  });

  it('POST /auth/confirm_otp -- valid OTP', async () => {
    const response = await request(app)
      .post(`${api}/auth/confirm_otp`)
      .send({
        receiver: 'test-user@gmail.com',
        code: '000000',
      });
    expect(response.statusCode).toBe(200);
  });

  it('POST /auth/confirm_otp -- invalid OTP', async () => {
    const response = await request(app)
      .post(`${api}/auth/confirm_otp`)
      .send({
        receiver: 'test-user@gmail.com',
        code: 'xxxxxx',
      });
    expect(response.statusCode).toBe(400);
  });
});
