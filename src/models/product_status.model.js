module.exports = function (sequelize, Sequelize) {
  return sequelize.define('product_status', {
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
};
