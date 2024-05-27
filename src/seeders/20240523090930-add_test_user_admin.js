const db = require('../models');

module.exports = {
  async up() {
    await db.user.create({
      email: 'test_user_601@shop3.com',
      password: 'AvTMhT',
      userGroupId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_602@shop3.com',
      password: 'DYapkf',
      userGroupId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_603@shop3.com',
      password: '7JeVjR',
      userGroupId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_604@shop3.com',
      password: 'mVkWJu',
      userGroupId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.user.create({
      email: 'test_user_605@shop3.com',
      password: 'TESrw7',
      userGroupId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'test_user_601@shop3.com' }, {});
    await queryInterface.bulkDelete('users', { email: 'test_user_602@shop3.com' }, {});
    await queryInterface.bulkDelete('users', { email: 'test_user_603@shop3.com' }, {});
    await queryInterface.bulkDelete('users', { email: 'test_user_604@shop3.com' }, {});
    await queryInterface.bulkDelete('users', { email: 'test_user_605@shop3.com' }, {});
  },
};
