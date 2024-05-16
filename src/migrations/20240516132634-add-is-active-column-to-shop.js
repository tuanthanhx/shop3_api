'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('shops', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'isVerified',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('shops', 'isActive');
  },
};
