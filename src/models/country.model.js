module.exports = function (sequelize, Sequelize) {
  return sequelize.define('country', {
    code: {
      type: Sequelize.STRING(2),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
