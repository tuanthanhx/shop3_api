module.exports = function (sequelize, Sequelize) {
  return sequelize.define('payment_method_paypal', {
    paymentMethodId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    accountName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
