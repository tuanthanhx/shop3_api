module.exports = function (sequelize, Sequelize) {
  return sequelize.define('user_log', {
    event: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
