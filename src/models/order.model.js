module.exports = function (sequelize, Sequelize) {
  return sequelize.define('order', {
    uniqueId: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    totalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
