module.exports = function (sequelize, Sequelize) {
  return sequelize.define('payment_method', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    paymentMethodTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isDefault: {
      type: Sequelize.BOOLEAN,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });
};
