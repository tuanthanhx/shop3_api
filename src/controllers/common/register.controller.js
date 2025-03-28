const logger = require('../../utils/logger');
const { checkOtp, removeOtp } = require('../../utils/otp');
const db = require('../../models');
const auth = require('./auth.controller');

const User = db.user;

exports.registerByEmail = async (req, res) => {
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
    if (foundUser) {
      res.status(409).send({
        message: 'An user with the provided email already exists',
      });
      return;
    }

    const object = {
      email,
      password,
      userGroupId: 2,
    };

    await User.create(object);
    await auth.loginByEmail(req, res);
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.registerByPhone = async (req, res) => {
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
    if (foundUser) {
      res.status(409).send({
        message: 'An user with the provided phone already exists',
      });
      return;
    }

    const object = {
      phone,
      password,
      userGroupId: 2,
    };

    await User.create(object);
    await auth.loginByPhone(req, res);
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
