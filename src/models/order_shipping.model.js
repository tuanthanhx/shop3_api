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
    zipCode: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    district: {
      type: Sequelize.STRING,
    },
    street: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    logisticsServiceName: {
      type: Sequelize.STRING,
    },
    logisticsProviderName: {
      type: Sequelize.STRING,
    },
    logisticsTrackingCode: {
      type: Sequelize.STRING,
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
