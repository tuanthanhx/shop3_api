module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('product_statuses', [
      {
        name: 'Active',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Inactive',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Reviewing',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Suspended',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Draft',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Deleted',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('product_statuses', null, {});
    await queryInterface.sequelize.query('ALTER TABLE product_statuses AUTO_INCREMENT = 1;');
  },
};
