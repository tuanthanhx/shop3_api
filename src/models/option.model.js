module.exports = function (sequelize, Sequelize) {
  return sequelize.define('option', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
