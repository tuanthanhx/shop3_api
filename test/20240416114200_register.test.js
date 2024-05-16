const request = require('supertest');
const { app } = require('../server');
const db = require('../src/models');

require('dotenv').config();

const api = `/api-common/${process.env.VERSION}`;

beforeAll(async () => {
  await db.user.destroy({
    where: {
      email: 'test-email-001@gmail.com',
    },
  });
  await db.user.destroy({
    where: {
      phone: '0900000001',
    },
  });
});

describe('Register by Email', () => {
  it('Success', async () => {
    const body = {
      email: 'test-email-001@gmail.com',
      password: '123456',
      passwordConfirm: '123456',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/email`).send(body);
    expect(response.statusCode).toBe(200);
  });
  it('Invalid Email', async () => {
    const body = {
      email: 'test-email-001',
      password: '123456',
      passwordConfirm: '123456',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/email`).send(body);
    expect(response.statusCode).toBe(400);
  });
  it('Duplicate Email', async () => {
    const body = {
      email: 'test-email-001@gmail.com',
      password: '123456',
      passwordConfirm: '123456',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/email`).send(body);
    expect(response.statusCode).toBe(409);
  });
  it('Invalid OTP', async () => {
    const body = {
      email: 'test-email-001@gmail.com',
      password: '123456',
      passwordConfirm: '123456',
      verificationCode: '000001',
    };
    const response = await request(app).post(`${api}/register/email`).send(body);
    expect(response.statusCode).toBe(400);
  });
});

describe('Register by Phone', () => {
  it('Success', async () => {
    const body = {
      phone: '0900000001',
      password: '123456',
      passwordConfirm: '123456',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/phone`).send(body);
    expect(response.statusCode).toBe(200);
  });
  it('Duplicate Phone', async () => {
    const body = {
      phone: '0900000001',
      password: '123456',
      passwordConfirm: '123456',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/phone`).send(body);
    expect(response.statusCode).toBe(409);
  });
  it('Invalid OTP', async () => {
    const body = {
      phone: '0900000002',
      password: '123456',
      passwordConfirm: '123456',
      verificationCode: '000001',
    };
    const response = await request(app).post(`${api}/register/phone`).send(body);
    expect(response.statusCode).toBe(400);
  });
});
