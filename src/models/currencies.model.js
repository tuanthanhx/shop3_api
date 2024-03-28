module.exports = function (sequelize, Sequelize) {
  const Currency = sequelize.define('currency', {
    name: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
    symbol: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: true,
  });

  return Currency;
};
