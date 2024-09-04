module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('payment_method_types', [
      {
        name: 'Credit / Debit Card',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pay with Paypal',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cryptocurrencies',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Online payment systems',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('payment_method_types', null, {});
    await queryInterface.sequelize.query('ALTER TABLE payment_method_types AUTO_INCREMENT = 1;');
  },
};
