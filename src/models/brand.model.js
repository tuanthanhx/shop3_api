module.exports = function (sequelize, Sequelize) {
  return sequelize.define('brand', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  }, {
    paranoid: false,
  });
};
