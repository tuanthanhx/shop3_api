module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('user_groups', [
      {
        name: 'Users',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sellers',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Unused 03',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Unused 04',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'External / 3rd Parties',
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
