module.exports = function (sequelize, Sequelize) {
  return sequelize.define('news_comment', {
    content: {
      type: Sequelize.TEXT('long'),
      allowNull: false,
    },
    image: {
      type: Sequelize.JSON,
    },
    files: {
      type: Sequelize.JSON,
    },
  }, {
    paranoid: false,
  });
};
