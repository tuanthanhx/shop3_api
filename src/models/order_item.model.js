module.exports = function (sequelize, Sequelize) {
  return sequelize.define('order_item', {
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    productVariant: {
      type: Sequelize.JSON,
    },
  }, {
    paranoid: false,
  });
};
