module.exports = function (sequelize, Sequelize) {
  const ProductAttribute = sequelize.define('product_attribute', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    value: {
      type: Sequelize.JSON,
    },
  }, {
    paranoid: false,
  });

  return ProductAttribute;
};
