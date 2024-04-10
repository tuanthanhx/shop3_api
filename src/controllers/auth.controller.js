const jwt = require('jsonwebtoken');
const { generateRandomNumber } = require('../utils/utils');
const { sendEmail } = require('../utils/email');
const db = require('../models');

require('dotenv').config();

const User = db.user;
const Verification = db.verification;
const UserRefreshToken = db.user_refresh_token;
const { Op } = db.Sequelize;

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

exports.isLogin = async (req, res) => {
  if (req.user) {
    res.status(200).send({
      data: true,
    });
    return;
  }
  res.status(401).send({
    message: 'You are not logged in',
  });
};

exports.login = async (req, res) => {
  if (!req.body.email && !req.body.phone) {
    return res.status(400).json({ error: 'Either email or phone is required' });
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
      const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' });
      return res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Refresh token is invalid' });
  }
};

exports.resetPassword = async (req, res) => {
  if (!req.body.email && !req.body.phone) {
    res.status(400).send({
      message: 'Either email or phone is required',
    });
    return;
  }

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
      message: 'Cannot find an account with the provided email or phone number',
    });
    return;
  }

  if (verificationCode.toString() !== process.env.OTP_SECRET) {
    const findCode = await Verification.findOne({ where: { receiver: email || phone } });
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

  findUser.update(object)
    .then((data) => {
      res.send({
        data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred',
      });
    });
};

exports.generateOTP = async (req, res) => {
  if (!req.body.email && !req.body.phone) {
    res.status(400).send({
      message: 'Either email or phone is required',
    });
    return;
  }

  const { email, phone } = req.body;
  const code = generateRandomNumber(6);

  const object = {
    code,
  };

  if (email) {
    object.receiver = email;
  }

  if (phone) {
    object.receiver = phone;
  }

  Verification.findOne({ where: { receiver: object.receiver } })
    .then((verification) => {
      if (verification) {
        return verification.update({ code });
      }
      return Verification.create(object);
    })
    .then(async () => {
      if (email) {
        sendEmail(email, 'Verification Code', `Your verification code is: ${code}`);
      }
      res.send({ data: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred',
      });
    });
};
