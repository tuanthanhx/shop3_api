module.exports = function (sequelize, Sequelize) {
  return sequelize.define('wallet', {
    address: {
      type: Sequelize.STRING(32),
      unique: true,
      allowNull: false,
    },
    balance: {
      type: Sequelize.DECIMAL(30, 8),
      defaultValue: 0.00000000,
    },
  }, {
    paranoid: false,
  });
};
