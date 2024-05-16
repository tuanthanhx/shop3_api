const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { app } = require('../../server');
const db = require('../../src/models');

const api = `/api-common/${process.env.VERSION}`;

module.exports = async () => {
  await db.user.destroy({
    where: {
      email: 'test-user@gmail.com',
    },
  });

  const body = {
    email: 'test-user@gmail.com',
    password: '123456',
    passwordConfirm: '123456',
    verificationCode: '000000',
  };
  const response = await request(app).post(`${api}/register/email`).send(body);
  const token = response?.body?.data?.accessToken;
  fs.writeFileSync(path.resolve(__dirname, 'token.txt'), token);
};
