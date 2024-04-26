module.exports = function (sequelize, Sequelize) {
  const Attribute = sequelize.define('attribute', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });

  return Attribute;
};
