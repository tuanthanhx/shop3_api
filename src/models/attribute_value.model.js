module.exports = function (sequelize, Sequelize) {
  return sequelize.define('attribute_value', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
