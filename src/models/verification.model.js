module.exports = function (sequelize, Sequelize) {
  return sequelize.define('verification', {
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
};
