module.exports = function (sequelize, Sequelize) {
  const Category = sequelize.define('category', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    parentId: {
      type: Sequelize.INTEGER,
    },
  }, {
    paranoid: true,
  });

  return Category;
};
