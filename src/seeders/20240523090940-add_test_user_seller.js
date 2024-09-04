const db = require('../models');

module.exports = {
  async up () {
    await db.user.create({
      email: 'test_user_101@shop3.com',
      password: '123456',
      userGroupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_102@shop3.com',
      password: '123456',
      userGroupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_103@shop3.com',
      password: '123456',
      userGroupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_104@shop3.com',
      password: '123456',
      userGroupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_105@shop3.com',
      password: '123456',
      userGroupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: [
        'test_user_101@shop3.com',
        'test_user_102@shop3.com',
        'test_user_103@shop3.com',
        'test_user_104@shop3.com',
        'test_user_105@shop3.com',
      ],
    }, {});
  },
};
