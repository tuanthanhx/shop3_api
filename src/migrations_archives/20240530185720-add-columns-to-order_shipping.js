module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('order_shippings', 'logisticsServiceName', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('order_shippings', 'logisticsProviderName', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('order_shippings', 'logisticsTrackingCode', {
      type: Sequelize.STRING,
    });
  },
};
