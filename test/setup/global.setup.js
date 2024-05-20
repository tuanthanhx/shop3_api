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

  await db.user.destroy({
    where: {
      phone: '0399111111',
    },
  });

  await db.shop.destroy({
    where: {
      shopName: 'Test Shop',
    },
  });

  const response1 = await request(app).post(`${api}/register/email`).send({
    email: 'test-user@gmail.com',
    password: '123456',
    passwordConfirm: '123456',
    verificationCode: '000000',
  });
  const accessToken1 = response1?.body?.data?.accessToken;
  const refreshToken1 = response1?.body?.data?.refreshToken;
  fs.writeFileSync(path.resolve(__dirname, 'access_token_email.txt'), accessToken1);
  fs.writeFileSync(path.resolve(__dirname, 'refresh_token_email.txt'), refreshToken1);

  const user = await db.user.findOne({
    where: { email: 'test-user@gmail.com'}
  });

  if (user?.id) {
    await db.shop.create({
      shopName: 'Test Shop',
      sellerBusinessTypeId: 1,
      userId: user.id,
    });
  }

  const response2 = await request(app).post(`${api}/register/phone`).send({
    phone: '0399111111',
    password: '123456',
    passwordConfirm: '123456',
    verificationCode: '000000',
  });
  const accessToken2 = response2?.body?.data?.accessToken;
  const refreshToken2 = response2?.body?.data?.refreshToken;
  fs.writeFileSync(path.resolve(__dirname, 'access_token_phone.txt'), accessToken2);
  fs.writeFileSync(path.resolve(__dirname, 'refresh_token_phone.txt'), refreshToken2);
};
