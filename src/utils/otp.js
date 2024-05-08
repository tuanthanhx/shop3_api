const dayjs = require('dayjs');
const { generateRandomNumber } = require('./utils');
const logger = require('./logger');
const db = require('../models');

require('dotenv').config();

exports.createOtp = async (receiver) => {
  const code = generateRandomNumber(6);
  try {
    const [foundOtp, created] = await db.verification.findOrCreate({
      where: { receiver },
      defaults: { code },
    });
    if (!created) {
      await foundOtp.update({ code });
    }
    return code;
  } catch (err) {
    logger.error(err);
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
    const foundOtp = await db.verification.findOne({
      where: {
        receiver,
        code,
        updatedAt: {
          [db.Sequelize.Op.gte]: dayjs().subtract(1, 'hour').toDate(),
        },
      },
    });
    if (foundOtp) {
      return true;
    }
  } catch (err) {
    logger.error(err);
  }
  return false;
};

exports.removeOtp = async (receiver) => {
  if (!receiver) return false;

  try {
    const foundOtp = await db.verification.findOne({
      where: {
        receiver,
      },
    });
    if (foundOtp) {
      await foundOtp.destroy();
      return true;
    }
  } catch (err) {
    logger.error(err);
  }
  return false;
};
