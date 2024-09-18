module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('order_shippings', 'zipCode', {
      type: Sequelize.STRING,
      after: 'countryCode',
    });
    await queryInterface.addColumn('order_shippings', 'state', {
      type: Sequelize.STRING,
      after: 'zipCode',
    });
    await queryInterface.addColumn('order_shippings', 'city', {
      type: Sequelize.STRING,
      after: 'state',
    });
    await queryInterface.addColumn('order_shippings', 'district', {
      type: Sequelize.STRING,
      after: 'city',
    });
    await queryInterface.addColumn('order_shippings', 'street', {
      type: Sequelize.STRING,
      after: 'district',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('order_shippings', 'zipCode');
    await queryInterface.removeColumn('order_shippings', 'state');
    await queryInterface.removeColumn('order_shippings', 'city');
    await queryInterface.removeColumn('order_shippings', 'district');
    await queryInterface.removeColumn('order_shippings', 'street');
  },
};
