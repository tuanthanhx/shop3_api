module.exports = function (sequelize, Sequelize) {
  return sequelize.define('user_address', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
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
    isDefault: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });
};
