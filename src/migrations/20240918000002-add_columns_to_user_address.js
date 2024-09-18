module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_addresses', 'street', {
      type: Sequelize.STRING,
      after: 'district',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('user_addresses', 'street');
  },
};
