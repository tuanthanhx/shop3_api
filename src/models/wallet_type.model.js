module.exports = function (sequelize, Sequelize) {
  return sequelize.define('wallet_type', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unit: {
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
