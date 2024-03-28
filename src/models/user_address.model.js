module.exports = function (sequelize, Sequelize) {
  const UserAddress = sequelize.define('user_address', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    address_line1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address_line2: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    postcode: {
      type: Sequelize.STRING,
    },
    country_code: {
      type: Sequelize.STRING(2),
    },
    is_default: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: true,
  });

  return UserAddress;
};
