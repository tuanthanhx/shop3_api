module.exports = function (sequelize, Sequelize) {
  return sequelize.define('file', {
    file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    key: {
      type: Sequelize.STRING,
    },
    folder: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
