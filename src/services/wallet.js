const crypto = require('crypto');
const db = require('../models');
const logger = require('../utils/logger');
require('dotenv').config();

exports.createWallet = async (userId, walletTypeId) => {
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      logger.error('Error occurred while creating wallet: User not found');
      return false;
    }
    const address = crypto.createHash('md5').update(user.id.toString()).digest('hex');
    const wallet = await db.wallet.create({
      userId,
      walletTypeId,
      address,
      balance: 0,
    });
    return wallet;
  } catch (error) {
    logger.error('Error occurred while creating wallet:', error);
    return false;
  }
};
