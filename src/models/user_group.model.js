module.exports = function (sequelize, Sequelize) {
  const UserGroup = sequelize.define('user_group', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: true,
  });

  return UserGroup;
};
