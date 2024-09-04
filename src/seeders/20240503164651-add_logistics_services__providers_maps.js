module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('logistics_services_providers_maps', [
      {
        logisticsServiceId: 1,
        logisticsProviderId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 1,
        logisticsProviderId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 1,
        logisticsProviderId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('logistics_services_providers_maps', null, {});
    await queryInterface.sequelize.query('ALTER TABLE logistics_services_providers_maps AUTO_INCREMENT = 1;');
  },
};
