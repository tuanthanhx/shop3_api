const { generateUniqueId } = require('../utils/utils');
const db = require('../models');

module.exports = {
  async up (queryInterface) {
    const shop101 = await db.shop.findOne({ where: { shopName: 'Test Shop 101' } });
    const shop102 = await db.shop.findOne({ where: { shopName: 'Test Shop 102' } });
    await queryInterface.bulkInsert('products', [
      {
        name: 'Test Product 101',
        uniqueId: generateUniqueId(),
        shopId: shop101.id,
        categoryId: 1,
        brandId: 1,
        productStatusId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Product 102',
        uniqueId: generateUniqueId(),
        shopId: shop101.id,
        categoryId: 1,
        brandId: 1,
        productStatusId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Product 103',
        uniqueId: generateUniqueId(),
        shopId: shop102.id,
        categoryId: 1,
        brandId: 1,
        productStatusId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('products', {
      name: [
        'Test Product 101',
        'Test Product 102',
        'Test Product 103',
      ],
    }, {});
  },
};
