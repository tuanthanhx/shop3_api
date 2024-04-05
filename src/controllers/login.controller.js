const jwt = require('jsonwebtoken');
const { generateRandomNumber } = require('../utils/utils');
const db = require('../models');

require('dotenv').config();

const User = db.user;
const Verification = db.verification;
const UserRefreshToken = db.user_refresh_token;
const { Op } = db.Sequelize;

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

exports.login = async (req, res) => {
  if (!req.body.email && !req.body.phone) {
    res.status(400).send({
      message: 'Need to provide at least an email address or a phone number',
    });
    return;
  }

  const { email, phone, password } = req.body;

  let whereCondition = {};
  if (email && phone) {
    whereCondition = { [Op.or]: [{ email }, { phone }] };
  } else if (email) {
    whereCondition = { email };
  } else if (phone) {
    whereCondition = { phone };
  }

  try {
    const user = await User.findOne({ where: whereCondition, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret, { expiresIn: '30d' });

    const findToken = await UserRefreshToken.findOne({ where: { user_id: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, user_id: user.id });
    }

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token is not valid 1' });
    return;
  }

  try {
    const findRefreshToken = await UserRefreshToken.findOne({ where: { token: refreshToken } });
    if (!findRefreshToken) {
      res.status(401).json({ error: 'Refresh token is not valid 2' });
      return;
    }

    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token is not valid 3' });
      }
      const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' });
      return res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Refresh token is not valid 4' });
  }
};

exports.generateSms = async (req, res) => {
  if (!req.body.phone) {
    res.status(400).send({
      message: 'Need to provide a phone number',
    });
    return;
  }

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
      res.send({ data: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred.',
      });
    });
};

exports.resetPassword = async (req, res) => {
  if (!req.body.email && !req.body.phone) {
    res.status(400).send({
      message: 'Need to provide at least an email address or a phone number',
    });
    return;
  }

  if (
    (!req.body.password && !req.body.password_confirm)
    || (req.body.password !== req.body.password_confirm)
  ) {
    res.status(400).send({
      message: 'Password and confirm password does not match.',
    });
    return;
  }

  if (!req.body.verification_code) {
    res.status(400).send({
      message: 'Verification code cannot be empty.',
    });
    return;
  }

  const {
    email,
    phone,
    password,
    verification_code: verificationCode,
  } = req.body;

  let whereCondition = {};
  if (email && phone) {
    whereCondition = { [Op.or]: [{ email }, { phone }] };
  } else if (email) {
    whereCondition = { email };
  } else if (phone) {
    whereCondition = { phone };
  }

  const findUser = await User.findOne({ where: whereCondition });
  if (!findUser) {
    res.status(400).send({
      message: 'Cannot find an account with the provided email or phone number.',
    });
    return;
  }

  if (verificationCode.toString() !== process.env.OTP_SECRET) {
    const findCode = await Verification.findOne({ where: { receiver: email || phone } });
    if (!findCode || verificationCode.toString() !== findCode?.dataValues?.code?.toString()) {
      res.status(400).send({
        message: 'The provided verification code is incorrect.',
      });
      return;
    }
  }

  const object = {
    password: findUser.generateHash(password),
  };

  findUser.update(object)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred.',
      });
    });
};
