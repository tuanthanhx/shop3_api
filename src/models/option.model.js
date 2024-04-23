module.exports = function (sequelize, Sequelize) {
  const Option = sequelize.define('option', {
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

  return Option;
};
