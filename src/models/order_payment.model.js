module.exports = function (sequelize, Sequelize) {
  return sequelize.define('order_payment', {
    paymentMethod: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
    },
  }, {
    paranoid: false,
  });
};
