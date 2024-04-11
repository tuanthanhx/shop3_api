const jwt = require('jsonwebtoken');
const { generateRandomNumber } = require('../utils/utils');
const { sendEmail } = require('../utils/email');
const db = require('../models');

require('dotenv').config();

const User = db.user;
const Verification = db.verification;
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

    const findToken = await UserRefreshToken.findOne({ where: { user_id: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, user_id: user.id });
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

    const findToken = await UserRefreshToken.findOne({ where: { user_id: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, user_id: user.id });
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
    await UserRefreshToken.destroy({ where: { user_id: req.user.id } });
  }
  res.status(204).end();
};

exports.refreshToken = async (req, res) => {
  const { refresh_token: refreshToken } = req.body;

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

exports.resetPasswordByEmail = async (req, res) => {
  if (
    (!req.body.password && !req.body.password_confirm)
    || (req.body.password !== req.body.password_confirm)
  ) {
    res.status(400).send({
      message: 'Password and confirm password does not match',
    });
    return;
  }

  const {
    email,
    password,
    verification_code: verificationCode,
  } = req.body;

  const findUser = await User.findOne({ where: { email } });
  if (!findUser) {
    res.status(400).send({
      message: 'Cannot find an account with the provided email',
    });
    return;
  }

  if (verificationCode.toString() !== process.env.OTP_SECRET) {
    const findCode = await Verification.findOne({ where: { receiver: email } });
    if (!findCode || verificationCode.toString() !== findCode?.dataValues?.code?.toString()) {
      res.status(400).send({
        message: 'The provided verification code is incorrect',
      });
      return;
    }
  }

  const object = {
    password: findUser.generateHash(password),
  };

  try {
    await findUser.update(object);
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
    (!req.body.password && !req.body.password_confirm)
    || (req.body.password !== req.body.password_confirm)
  ) {
    res.status(400).send({
      message: 'Password and confirm password does not match',
    });
    return;
  }

  const {
    phone,
    password,
    verification_code: verificationCode,
  } = req.body;

  const findUser = await User.findOne({ where: { phone } });
  if (!findUser) {
    res.status(400).send({
      message: 'Cannot find an account with the provided phone',
    });
    return;
  }

  if (verificationCode.toString() !== process.env.OTP_SECRET) {
    const findCode = await Verification.findOne({ where: { receiver: phone } });
    if (!findCode || verificationCode.toString() !== findCode?.dataValues?.code?.toString()) {
      res.status(400).send({
        message: 'The provided verification code is incorrect',
      });
      return;
    }
  }

  const object = {
    password: findUser.generateHash(password),
  };

  try {
    await findUser.update(object);
    res.send({
      data: true,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.generateOtpByEmail = async (req, res) => {
  const { email } = req.body;
  const code = generateRandomNumber(6);

  const object = {
    code,
    receiver: email,
  };

  Verification.findOne({ where: { receiver: email } })
    .then((verification) => {
      if (verification) {
        return verification.update({ code });
      }
      return Verification.create(object);
    })
    .then(async () => {
      sendEmail(email, 'Verification Code', `Your verification code is: ${code}`);
      res.send({ data: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred',
      });
    });
};

exports.generateOtpByPhone = async (req, res) => {
  const { phone } = req.body;
  const code = generateRandomNumber(6);

  const object = {
    code,
    receiver: phone,
  };

  Verification.findOne({ where: { receiver: phone } })
    .then((verification) => {
      if (verification) {
        return verification.update({ code });
      }
      return Verification.create(object);
    })
    .then(async () => {
      // TODO: Make SMS feature later
      // sendSms(phone, 'Verification Code', `Your verification code is: ${code}`);
      res.send({ data: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred',
      });
    });
};
