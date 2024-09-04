const db = require('../models');

module.exports = {
  async up (queryInterface) {
    const user101 = await db.user.findOne({ where: { email: 'test_user_101@shop3.com' } });
    const user102 = await db.user.findOne({ where: { email: 'test_user_102@shop3.com' } });
    const user103 = await db.user.findOne({ where: { email: 'test_user_103@shop3.com' } });
    await queryInterface.bulkInsert('shops', [
      {
        shopName: 'Test Shop 101',
        sellerBusinessTypeId: 1,
        userId: user101.id,
        isSubmitted: true,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopName: 'Test Shop 102',
        sellerBusinessTypeId: 2,
        userId: user102.id,
        isSubmitted: true,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        shopName: 'Test Shop 103',
        sellerBusinessTypeId: 3,
        userId: user103.id,
        isSubmitted: true,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('shops', {
      shopName: [
        'Test Shop 101',
        'Test Shop 102',
        'Test Shop 103',
      ],
    }, {});
  },
};
