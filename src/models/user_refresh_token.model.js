module.exports = function (sequelize, Sequelize) {
  const UserRefreshToken = sequelize.define('user_refresh_token', {
    token: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });

  return UserRefreshToken;
};
