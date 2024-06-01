module.exports = function (sequelize, Sequelize) {
  return sequelize.define('payment_method_cryptocurrency', {
    paymentMethodId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    walletAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
