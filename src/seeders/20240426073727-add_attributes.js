module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('attributes', [
      {
        name: 'Season',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Care Instructions',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Clothing Length',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { returning: true });

    const attributeIds = await queryInterface.sequelize.query(
      'SELECT id FROM attributes;',
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    const categoryAttributeMaps = [];

    attributeIds.forEach((attribute) => {
      categoryAttributeMaps.push({
        categoryId: 1,
        attributeId: attribute.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await queryInterface.bulkInsert('category_attribute_maps', categoryAttributeMaps);

    await queryInterface.bulkInsert('attribute_values', [
      {
        name: 'Spring',
        attributeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Summer',
        attributeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fall',
        attributeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Winter',
        attributeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'All Seasons',
        attributeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
    await queryInterface.bulkInsert('attribute_values', [
      {
        name: 'Hand Wash',
        attributeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dry Clean',
        attributeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Do Not Wash',
        attributeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Do Not Dry Clean',
        attributeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Machine Washable',
        attributeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cold Wash',
        attributeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
    await queryInterface.bulkInsert('attribute_values', [
      {
        name: 'Short',
        attributeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Medium',
        attributeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '3/4 Length',
        attributeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Long',
        attributeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('attributes', null, {});
    await queryInterface.sequelize.query('ALTER TABLE attributes AUTO_INCREMENT = 1;');
    await queryInterface.bulkDelete('attribute_values', null, {});
    await queryInterface.sequelize.query('ALTER TABLE attribute_values AUTO_INCREMENT = 1;');
  },
};
