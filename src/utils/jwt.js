// const path = require('path');
// const logger = require('./logger');

// const crypto = require('crypto');
const {
  // decodeJwt,
  // JWTPayload,
  // jwtVerify,
  SignJWT,
} = require('jose');

require('dotenv').config();

const buildCreateToken = (expirationTime) => async (payload) => {
  // const key = crypto.createSecretKey(Buffer.from(process.env.JWT_ACCESS_SECRET, 'utf-8'));
  const encoder = new TextEncoder();
  const key = encoder.encode(process.env.JWT_ACCESS_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(key);
};

exports.createPayloadToken = buildCreateToken('15m');
