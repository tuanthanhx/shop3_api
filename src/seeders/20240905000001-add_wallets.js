const db = require('../models');
const walletService = require('../services/wallet');

module.exports = {
  async up () {
    const users = await db.user.findAll();
    for (const user of users) {
      await walletService.createWallet(user.id, 1);
    }
  },
};
