module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'walletAddress', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'walletAddress');
  }
};
