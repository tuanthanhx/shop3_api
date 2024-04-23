module.exports = function (sequelize, Sequelize) {
  const Brand = sequelize.define('brand', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
    }
  }, {
    paranoid: true,
  });

  return Brand;
};
