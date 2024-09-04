const db = require('../models');

module.exports = {
  async up () {
    await db.user.create({
      email: 'test_user_202@shop3.com',
      password: '123456',
      userGroupId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'test_user_202@shop3.com' }, {});
  },
};
