module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'referrerId', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
