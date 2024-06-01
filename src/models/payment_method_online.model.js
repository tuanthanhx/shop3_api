module.exports = function (sequelize, Sequelize) {
  return sequelize.define('payment_method_online', {
    paymentMethodId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    serviceName: {
      type: Sequelize.STRING,
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
