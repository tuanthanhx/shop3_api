const crypto = require('crypto');
// const db = require('../models');
const logger = require('../utils/logger');
require('dotenv').config();

exports.generateSignature = (content, keys, provider = null) => {
  const toSign = content + keys;
  let signature = '';
  if (provider === 'best') {
    signature = crypto.createHash('md5').update(toSign, 'utf8').digest('hex');
  } else {
    const hashBuffer = crypto.createHash('md5').update(toSign, 'utf8').digest();
    signature = hashBuffer.toString('base64');
  }
  return signature;
};

exports.createOrder = async (orderId) => {
  try {
    // const user = await db.user.findByPk(userId);
    // if (!user) {
    //   logger.error('Error occurred while creating wallet: User not found');
    //   return false;
    // }
    // const address = crypto.createHash('md5').update(user.id.toString()).digest('hex');
    // const wallet = await db.wallet.create({
    //   userId,
    //   walletTypeId,
    //   address,
    //   balance: 0,
    // });
    // return wallet;
    const createdOrder = { orderId };
    return createdOrder;
  } catch (error) {
    logger.error('Error occurred while creating wallet:', error);
    return false;
  }
};
