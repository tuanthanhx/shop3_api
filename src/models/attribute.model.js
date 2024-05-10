module.exports = function (sequelize, Sequelize) {
  return sequelize.define('attribute', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
