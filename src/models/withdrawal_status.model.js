module.exports = function (sequelize, Sequelize) {
  return sequelize.define('withdrawal_status', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
  }, {
    paranoid: false,
  });
};
