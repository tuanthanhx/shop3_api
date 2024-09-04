const db = require('../models');

module.exports = {
  async up () {
    await db.user.create({
      email: 'test_user_111@shop3.com',
      password: '123456',
      userGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_112@shop3.com',
      password: '123456',
      userGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_113@shop3.com',
      password: '123456',
      userGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_114@shop3.com',
      password: '123456',
      userGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_115@shop3.com',
      password: '123456',
      userGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: [
        'test_user_111@shop3.com',
        'test_user_112@shop3.com',
        'test_user_113@shop3.com',
        'test_user_114@shop3.com',
        'test_user_115@shop3.com',
      ],
    }, {});
  },
};
