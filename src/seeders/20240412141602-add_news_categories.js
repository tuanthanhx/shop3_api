module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('news_categories', [
      {
        name: 'Business',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Customer Success',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Education',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Finance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Health and Wellness',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Software Development',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Travel',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('news_categories', null, {});
    await queryInterface.sequelize.query('ALTER TABLE news_categories AUTO_INCREMENT = 1;');
  },
};
