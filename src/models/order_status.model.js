module.exports = function (sequelize, Sequelize) {
  return sequelize.define('order_status', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
