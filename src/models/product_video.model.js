module.exports = function (sequelize, Sequelize) {
  const ProductVideo = sequelize.define('product_video', {
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

  return ProductVideo;
};
