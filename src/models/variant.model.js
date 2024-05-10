module.exports = function (sequelize, Sequelize) {
  return sequelize.define('variant', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
