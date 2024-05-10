module.exports = function (sequelize, Sequelize) {
  return sequelize.define('product_variant', {
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    sku: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
