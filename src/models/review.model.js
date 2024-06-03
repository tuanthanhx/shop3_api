module.exports = function (sequelize, Sequelize) {
  return sequelize.define('review', {
    rate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
    },
    images: {
      type: Sequelize.JSON,
    },
    videos: {
      type: Sequelize.JSON,
    },
  }, {
    paranoid: false,
  });
};
