module.exports = function (sequelize, Sequelize) {
  return sequelize.define('order_withdrawal', {
    amount: {
      type: Sequelize.DECIMAL(30, 8),
      defaultValue: 0.00000000,
    },
  }, {
    paranoid: false,
  });
};
