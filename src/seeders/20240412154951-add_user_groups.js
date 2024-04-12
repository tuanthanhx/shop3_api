module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('user_groups', [
      {
        name: 'Unregistered / Not Logged In',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Registered Users',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Users Awaiting Email Confirmation',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Users Awaiting Moderation',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Moderators',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Administrators',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_groups', null, {});
    await queryInterface.sequelize.query('ALTER TABLE user_groups AUTO_INCREMENT = 1;');
  },
};
