module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('order_shippings', 'logisticsObject', {
      type: Sequelize.JSON,
      after: 'logisticsTrackingCode',
    });
  },
};
