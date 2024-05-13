module.exports = function (sequelize, Sequelize) {
  return sequelize.define('category', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
    },
    parentId: {
      type: Sequelize.INTEGER,
    },
  }, {
    paranoid: false,
  });
};
