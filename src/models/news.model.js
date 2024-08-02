module.exports = function (sequelize, Sequelize) {
  return sequelize.define('news', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    excerpt: {
      type: Sequelize.TEXT,
    },
    content: {
      type: Sequelize.TEXT('long'),
    },
    thumbnail: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    isPublished: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });
};
