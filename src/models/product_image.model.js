module.exports = function (sequelize, Sequelize) {
  const ProductImage = sequelize.define('product_image', {
    file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    paranoid: true,
  });

  return ProductImage;
};
