module.exports = function (sequelize, Sequelize) {
  return sequelize.define('warehouse', {
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
    isDefault: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });
};
