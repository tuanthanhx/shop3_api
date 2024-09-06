const db = require('../models');
const logger = require('../utils/logger');
require('dotenv').config();

exports.findByUser = async (userId) => {
  try {
    const shop = await db.shop.findOne({
      where: {
        userId,
      },
    });
    if (!shop) {
      logger.error('Shop not found');
      return false;
    }
    return shop;
  } catch (error) {
    logger.error('Error occurred while creating wallet:', error);
    return false;
  }
};
