module.exports = function (sequelize, Sequelize) {
  return sequelize.define('withdrawal', {
    amount: {
      type: Sequelize.DECIMAL(30, 8),
      defaultValue: 0.00000000,
    },
    network: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    memo: {
      type: Sequelize.STRING,
    },
    hash: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
  });
};
