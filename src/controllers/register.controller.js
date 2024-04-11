const db = require('../models');
const auth = require('./auth.controller');

const User = db.user;
const Verification = db.verification;

exports.registerByEmail = async (req, res) => {
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

  if (verificationCode.toString() !== process.env.OTP_SECRET) {
    const findCode = await Verification.findOne({ where: { receiver: email } });
    if (!findCode || verificationCode.toString() !== findCode?.dataValues?.code?.toString()) {
      res.status(400).send({
        message: 'The provided verification code is incorrect',
      });
      return;
    }
  }

  const findUser = await User.findOne({ where: { email } });
  if (findUser) {
    res.status(400).send({
      message: 'An user with the provided email already exists',
    });
    return;
  }

  const object = {
    email,
    password,
  };

  try {
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

  if (verificationCode.toString() !== process.env.OTP_SECRET) {
    const findCode = await Verification.findOne({ where: { receiver: phone } });
    if (!findCode || verificationCode.toString() !== findCode?.dataValues?.code?.toString()) {
      res.status(400).send({
        message: 'The provided verification code is incorrect',
      });
      return;
    }
  }

  const findUser = await User.findOne({ where: { phone } });
  if (findUser) {
    res.status(400).send({
      message: 'An user with the provided phone already exists',
    });
    return;
  }

  const object = {
    phone,
    password,
  };

  try {
    await User.create(object);
    await auth.loginByPhone(req, res);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
