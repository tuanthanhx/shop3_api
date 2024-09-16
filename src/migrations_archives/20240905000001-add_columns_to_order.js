module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'isWithdrawn', {
      type: Sequelize.BOOLEAN,
      after: 'totalAmount',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('orders', 'isWithdrawn');
  },
};
