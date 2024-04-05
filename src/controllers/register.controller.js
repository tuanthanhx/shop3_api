const { generateRandomNumber } = require('../utils/utils');
const { sendEmail } = require('../utils/email');
const db = require('../models');

const User = db.user;
const Verification = db.verification;
const { Op } = db.Sequelize;

exports.generateVerificationCode = (req, res) => {
  if (!req.body.email && !req.body.phone) {
    res.status(400).send({
      message: 'Need to provide at least an email address or a phone number',
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
        message: err.message || 'Some error occurred.',
      });
    });
};

exports.register = async (req, res) => {
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

  if (verificationCode.toString() !== process.env.OTP_SECRET) {
    const findCode = await Verification.findOne({ where: { receiver: email || phone } });
    if (!findCode || verificationCode.toString() !== findCode?.dataValues?.code?.toString()) {
      res.status(400).send({
        message: 'The provided verification code is incorrect.',
      });
      return;
    }
  }

  let whereCondition = {};
  if (email && phone) {
    whereCondition = { [Op.or]: [{ email }, { phone }] };
  } else if (email) {
    whereCondition = { email };
  } else if (phone) {
    whereCondition = { phone };
  }

  const findUser = await User.findOne({ where: whereCondition });
  if (findUser) {
    res.status(400).send({
      message: 'An user with the provided email or phone number already exists.',
    });
    return;
  }

  const object = {
    phone,
    email,
    password,
  };

  User.create(object)
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
