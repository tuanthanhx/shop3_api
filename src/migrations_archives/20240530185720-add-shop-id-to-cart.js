module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('carts', 'shopId', {
      type: Sequelize.INTEGER,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('carts', 'shopId');
  },
};
