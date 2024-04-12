const { checkOtp, removeOtp } = require('../utils/otp');
const db = require('../models');
const auth = require('./auth.controller');

const User = db.user;

exports.registerByEmail = async (req, res) => {
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
    if (foundUser) {
      res.status(400).send({
        message: 'An user with the provided email already exists',
      });
      return;
    }

    const object = {
      email,
      password,
    };

    await User.create(object);
    await auth.loginByEmail(req, res);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.registerByPhone = async (req, res) => {
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
    if (foundUser) {
      res.status(400).send({
        message: 'An user with the provided phone already exists',
      });
      return;
    }

    const object = {
      phone,
      password,
    };

    await User.create(object);
    await auth.loginByPhone(req, res);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
