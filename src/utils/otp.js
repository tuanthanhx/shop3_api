const dayjs = require('dayjs');
const { generateRandomNumber } = require('./utils');
const db = require('../models');

const { Op } = db.Sequelize;
const Verification = db.verification;

require('dotenv').config();

exports.createOtp = async (receiver) => {
  const code = generateRandomNumber(6);
  try {
    const [foundOtp, created] = await Verification.findOrCreate({
      where: { receiver },
      defaults: { code },
    });
    if (!created) {
      await foundOtp.update({ code });
    }
    return code;
  } catch (err) {
    console.error(err);
  }
  return false;
};

exports.checkOtp = async (receiver, code) => {
  if (!receiver || !code) return false;

  // TODO: Remove this test code later
  if (code.toString() === process.env.OTP_SECRET) {
    return true;
  }

  try {
    const foundOtp = await Verification.findOne({
      where: {
        receiver,
        code,
        updatedAt: {
          [Op.gte]: dayjs().subtract(1, 'hour').toDate(),
        },
      },
    });
    if (foundOtp) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  return false;
};

exports.removeOtp = async (receiver) => {
  if (!receiver) return false;

  try {
    const foundOtp = await Verification.findOne({
      where: {
        receiver,
      },
    });
    if (foundOtp) {
      await foundOtp.destroy();
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  return false;
};
