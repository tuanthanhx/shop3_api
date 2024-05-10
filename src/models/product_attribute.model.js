module.exports = function (sequelize, Sequelize) {
  return sequelize.define('product_attribute', {
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
};
