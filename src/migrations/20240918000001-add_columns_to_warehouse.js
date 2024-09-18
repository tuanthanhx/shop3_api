module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('warehouses', 'street', {
      type: Sequelize.STRING,
      after: 'district',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('warehouses', 'street');
  },
};
