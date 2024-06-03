module.exports = function (sequelize, Sequelize) {
  return sequelize.define('order_tracking', {
    message: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
