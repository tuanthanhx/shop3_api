module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'thumbnailImage', {
      type: Sequelize.STRING,
      after: 'brandId',
    });
  },
};
