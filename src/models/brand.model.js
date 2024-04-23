module.exports = function (sequelize, Sequelize) {
  const Brand = sequelize.define('brand', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
  }, {
    paranoid: true,
  });

  return Brand;
};
