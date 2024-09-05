const db = require('../models');

module.exports = {
  async up() {
    await db.wallet_type.create({
      name: 'Default',
      unit: 'USDT',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
};
