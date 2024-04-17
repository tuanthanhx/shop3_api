module.exports = function (sequelize, Sequelize) {
  const Option = sequelize.define('option', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });

  return Option;
};
