module.exports = function (sequelize, Sequelize) {
  return sequelize.define('language', {
    name: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
