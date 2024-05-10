module.exports = function (sequelize, Sequelize) {
  return sequelize.define('product_image', {
    file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
