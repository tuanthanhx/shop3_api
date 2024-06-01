module.exports = function (sequelize, Sequelize) {
  return sequelize.define('payment_method_card', {
    paymentMethodId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    cardName: {
      type: Sequelize.STRING,
    },
    cardNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expYear: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expMonth: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ccv: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
