module.exports = function (sequelize, Sequelize) {
  const ProductImage = sequelize.define('product_image', {
    file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });

  return ProductImage;
};
