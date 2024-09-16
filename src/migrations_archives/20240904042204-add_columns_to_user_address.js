module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_addresses', 'zipCode', {
      type: Sequelize.STRING,
      after: 'countryCode',
    });
    await queryInterface.addColumn('user_addresses', 'state', {
      type: Sequelize.STRING,
      after: 'zipCode',
    });
    await queryInterface.addColumn('user_addresses', 'city', {
      type: Sequelize.STRING,
      after: 'state',
    });
    await queryInterface.addColumn('user_addresses', 'district', {
      type: Sequelize.STRING,
      after: 'city',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('user_addresses', 'zipCode');
    await queryInterface.removeColumn('user_addresses', 'state');
    await queryInterface.removeColumn('user_addresses', 'city');
    await queryInterface.removeColumn('user_addresses', 'district');
  },
};
