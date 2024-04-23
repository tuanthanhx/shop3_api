module.exports = function (sequelize, Sequelize) {
  const ProductVideo = sequelize.define('product_video', {
    file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });

  return ProductVideo;
};
