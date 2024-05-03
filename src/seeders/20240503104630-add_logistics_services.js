module.exports = {
  async up(queryInterface) {
    const { generateUniqueId } = require('../utils/utils');
    await queryInterface.bulkInsert('logistics_services', [
      {
        uniqueId: generateUniqueId(),
        name: 'Bulky shipping',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uniqueId: generateUniqueId(),
        name: 'Standard shipping',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('logistics_services', null, {});
    await queryInterface.sequelize.query('ALTER TABLE logistics_services AUTO_INCREMENT = 1;');
  },
};
