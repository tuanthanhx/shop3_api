module.exports = function (sequelize, Sequelize) {
  return sequelize.define('news_category', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
