module.exports = function (sequelize, Sequelize) {
  const Verification = sequelize.define('verification', {
    code: {
      type: Sequelize.STRING(6),
      allowNull: false,
    },
    receiver: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  }, {
    paranoid: false,
  });

  return Verification;
};
