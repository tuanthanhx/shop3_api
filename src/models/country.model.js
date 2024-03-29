module.exports = function (sequelize, Sequelize) {
  const Country = sequelize.define('country', {
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
    paranoid: true,
  });

  return Country;
};
