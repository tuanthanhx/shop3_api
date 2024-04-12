const jwt = require('jsonwebtoken');
const { createOtp, checkOtp, removeOtp } = require('../utils/otp');
const { sendEmail } = require('../utils/email');
const db = require('../models');

require('dotenv').config();

const User = db.user;
const UserRefreshToken = db.user_refresh_token;

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

exports.isLogin = async (req, res) => {
  if (req.user) {
    res.send({
      data: true,
    });
    return;
  }
  res.status(401).send({
    message: 'You are not logged in',
  });
};

exports.loginByEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email }, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

    const findToken = await UserRefreshToken.findOne({ where: { userId: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, userId: user.id });
    }

    res.json({
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.loginByPhone = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ where: { phone }, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).json({ error: 'Invalid phone or password' });
      return;
    }
    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

    const findToken = await UserRefreshToken.findOne({ where: { userId: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, userId: user.id });
    }

    res.json({
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  if (req.user?.id) {
    await UserRefreshToken.destroy({ where: { userId: req.user.id } });
  }
  res.status(204).end();
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token is invalid' });
    return;
  }

  try {
    const findRefreshToken = await UserRefreshToken.findOne({ where: { token: refreshToken } });
    if (!findRefreshToken) {
      res.status(401).json({ error: 'Refresh token is invalid' });
      return;
    }

    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token is invalid' });
      }
      const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
      return res.json({
        data: { accessToken },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Refresh token is invalid' });
  }
};

exports.generateOtpByEmail = async (req, res) => {
  const { email } = req.body;
  const code = await createOtp(email);
  if (!code) {
    res.status(500).json({ data: 'Cannot generate a verification code' });
    return;
  }
  sendEmail(email, 'Verification Code', `Your verification code is: ${code}`);
  res.send({ data: true });
};

exports.generateOtpByPhone = async (req, res) => {
  const { phone } = req.body;
  const code = await createOtp(phone);
  if (!code) {
    res.status(500).json({ data: 'Cannot generate a verification code' });
    return;
  }
  // TODO: Make SMS feature later
  // sendSms(phone, 'Verification Code', `Your verification code is: ${code}`);
  res.send({ data: true });
};

exports.confirmOtp = async (req, res) => {
  const { receiver, code, remove } = req.body;
  const verifyOtpResult = await checkOtp(receiver, code);
  if (!verifyOtpResult) {
    res.status(400).json({ data: 'Invalid verification code' });
  }
  if (remove) {
    await removeOtp(receiver);
  }
  res.send({ data: true });
};

exports.resetPasswordByEmail = async (req, res) => {
  if (
    (!req.body.password && !req.body.passwordConfirm)
    || (req.body.password !== req.body.passwordConfirm)
  ) {
    res.status(400).send({
      message: 'Password and confirm password does not match',
    });
    return;
  }

  const {
    email,
    password,
    verificationCode,
  } = req.body;

  try {
    const verifyOtpResult = await checkOtp(email, verificationCode);
    if (!verifyOtpResult) {
      res.status(400).json({ data: 'Invalid verification code' });
      return;
    }
    await removeOtp(email);

    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      res.status(404).send({
        message: 'Cannot find an account with the provided email',
      });
      return;
    }

    await foundUser.update({
      password: foundUser.generateHash(password),
    });

    res.send({
      data: true,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.resetPasswordByPhone = async (req, res) => {
  if (
    (!req.body.password && !req.body.passwordConfirm)
    || (req.body.password !== req.body.passwordConfirm)
  ) {
    res.status(400).send({
      message: 'Password and confirm password does not match',
    });
    return;
  }

  const {
    phone,
    password,
    verificationCode,
  } = req.body;

  try {
    const verifyOtpResult = await checkOtp(phone, verificationCode);
    if (!verifyOtpResult) {
      res.status(400).json({ data: 'Invalid verification code' });
      return;
    }
    await removeOtp(phone);

    const foundUser = await User.findOne({ where: { phone } });
    if (!foundUser) {
      res.status(404).send({
        message: 'Cannot find an account with the provided phone',
      });
      return;
    }

    await foundUser.update({
      password: foundUser.generateHash(password),
    });

    res.send({
      data: true,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
