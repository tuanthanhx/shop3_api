module.exports = function (sequelize, Sequelize) {
  return sequelize.define('order_shipping', {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    countryCode: {
      type: Sequelize.STRING(2),
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fee: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
