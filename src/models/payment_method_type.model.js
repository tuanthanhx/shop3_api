module.exports = function (sequelize, Sequelize) {
  return sequelize.define('payment_method_type', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });
};
