module.exports = function (sequelize, Sequelize) {
  const ProductStatus = sequelize.define('product_status', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
  }, {
    paranoid: false,
  });

  return ProductStatus;
};
