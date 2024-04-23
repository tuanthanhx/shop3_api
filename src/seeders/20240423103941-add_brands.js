module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('brands', [
      {
        name: 'Nike',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adidas',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Puma',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('brands', null, {});
    await queryInterface.sequelize.query('ALTER TABLE brands AUTO_INCREMENT = 1;');
  },
};
