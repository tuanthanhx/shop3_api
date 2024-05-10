module.exports = function (sequelize, Sequelize) {
  return sequelize.define('user_address', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    addressLine1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    postcode: {
      type: Sequelize.STRING,
    },
    countryCode: {
      type: Sequelize.STRING(2),
    },
    isDefault: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });
};
