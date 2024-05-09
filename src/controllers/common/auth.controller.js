const jwt = require('jsonwebtoken');
const logger = require('../../utils/logger');
const { createOtp, checkOtp, removeOtp } = require('../../utils/otp');
const { sendEmail } = require('../../utils/email');
const db = require('../../models');

require('dotenv').config();

const User = db.user;
const UserRefreshToken = db.user_refresh_token;

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

exports.isLogin = async (req, res) => {
  if (req.user) {
    res.send({
      data: req.user,
    });
    return;
  }
  res.status(401).send({
    message: 'You are not logged in',
  });
};

exports.findMe = async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.user;
    const foundUser = await db.user.findByPk(id);
    if (!foundUser) {
      res.status(404).send({
        message: 'Cannot find user with the provided ID',
      });
      return;
    }
    const userObject = foundUser.toJSON();
    const foundShop = await db.shop.findOne({ where: { userId: id } });
    if (foundShop) {
      userObject.shopId = foundShop.id;
    }
    res.send(userObject);
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.loginByEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email }, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).send({ error: 'Invalid email or password' });
      return;
    }

    const userIdentity = {
      id: user.id,
      uuid: user.uuid,
      userGroupId: user.userGroupId,
    };
    const accessToken = jwt.sign(userIdentity, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign(userIdentity, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

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
    logger.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.loginByPhone = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ where: { phone }, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).send({ error: 'Invalid phone or password' });
      return;
    }

    const userIdentity = {
      id: user.id,
      uuid: user.uuid,
      userGroupId: user.userGroupId,
    };
    const accessToken = jwt.sign(userIdentity, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign(userIdentity, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

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
    logger.error(error);
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
    res.status(401).send({ error: 'Refresh token is invalid' });
    return;
  }

  try {
    const findRefreshToken = await UserRefreshToken.findOne({ where: { token: refreshToken } });
    if (!findRefreshToken) {
      res.status(401).send({ error: 'Refresh token is invalid' });
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
    logger.error(error);
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
  try {
    const { receiver, code, remove } = req.body;
    const verifyOtpResult = await checkOtp(receiver, code);
    if (!verifyOtpResult) {
      res.status(400).json({ data: 'Invalid verification code' });
      return;
    }
    if (remove) {
      await removeOtp(receiver);
    }
    res.send({ data: true });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.resetPasswordByEmail = async (req, res) => {
  try {
    const {
      email,
      password,
      verificationCode,
    } = req.body;

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
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.resetPasswordByPhone = async (req, res) => {
  try {
    const {
      phone,
      password,
      verificationCode,
    } = req.body;

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
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
