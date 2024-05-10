module.exports = function (sequelize, Sequelize) {
  return sequelize.define('product_video', {
    file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
