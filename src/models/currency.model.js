module.exports = function (sequelize, Sequelize) {
  return sequelize.define('currency', {
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
    paranoid: false,
  });
};
