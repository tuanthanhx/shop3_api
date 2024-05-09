module.exports = function (sequelize, Sequelize) {
  return sequelize.define('user_group', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
