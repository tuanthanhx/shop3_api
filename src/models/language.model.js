module.exports = function (sequelize, Sequelize) {
  const Language = sequelize.define('language', {
    name: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: true,
  });

  return Language;
};
