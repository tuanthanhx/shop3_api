module.exports = function (sequelize, Sequelize) {
  const UserVerification = sequelize.define('user_verification', {
    code: {
      type: Sequelize.STRING(6),
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    paranoid: true,
  });

  return UserVerification;
};
