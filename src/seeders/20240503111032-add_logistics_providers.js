module.exports = {
  async up(queryInterface) {
    const { generateUniqueId } = require('../utils/utils');
    await queryInterface.bulkInsert('logistics_providers', [
      {
        uniqueId: generateUniqueId(),
        name: 'J&T Express',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/j%26t.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'BEST Express',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/best_express.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'Nhat Tin Logistics',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/nhat_tin.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'Ninja Van Vietnam',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/nhat_tin.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'Vietnam Post',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/vietnam_post.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'GHTK',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/giao_hang_tiet_kiem.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'Viettel Post VTP',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/viettel_post.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'GHN',
        description: null,
        logo: 'https://storage.googleapis.com/media-bucket-dev/public/logistics/providers/giao_hang_nhanh.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('logistics_providers', null, {});
    await queryInterface.sequelize.query('ALTER TABLE logistics_providers AUTO_INCREMENT = 1;');
  },
};
