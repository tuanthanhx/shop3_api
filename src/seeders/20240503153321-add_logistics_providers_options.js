module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('logistics_provider_options', [
      {
        logisticsServiceId: 1,
        logisticsProviderId: 1,
        packageWeightMin: 0,
        packageWeightMax: 70000,
        packageWidthMax: 140,
        packageHeightMax: 140,
        packageLengthMax: 140,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 1,
        logisticsProviderId: 2,
        packageWeightMin: 0,
        packageWeightMax: 80000,
        packageWidthMax: 180,
        packageHeightMax: 180,
        packageLengthMax: 180,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 1,
        logisticsProviderId: 3,
        packageWeightMin: 0,
        packageWeightMax: 120000,
        packageWidthMax: 180,
        packageHeightMax: 180,
        packageLengthMax: 180,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        logisticsServiceId: 2,
        logisticsProviderId: 1,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 2,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 3,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 4,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 5,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 6,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 7,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        logisticsServiceId: 2,
        logisticsProviderId: 8,
        packageWeightMin: 0,
        packageWeightMax: 20000,
        packageWidthMax: 100,
        packageHeightMax: 100,
        packageLengthMax: 100,
        codSupported: true,
        cpSupported: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('logistics_provider_options', null, {});
    await queryInterface.sequelize.query('ALTER TABLE logistics_provider_options AUTO_INCREMENT = 1;');
  },
};
