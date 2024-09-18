module.exports = {
  async up (queryInterface) {
    await queryInterface.removeConstraint('users', 'users_referrerId_foreign_idx');
  },
};
