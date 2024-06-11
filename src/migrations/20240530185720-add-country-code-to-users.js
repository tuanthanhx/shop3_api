module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'countryCode', {
      type: Sequelize.STRING(2),
      after: 'dob',
      references: {
        model: 'countries',
        key: 'code',
      },
    });
  },
};
