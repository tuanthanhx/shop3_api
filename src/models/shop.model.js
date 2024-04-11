module.exports = function (sequelize, Sequelize) {
  const Shop = sequelize.define('shop', {
    shopName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sellerBusinessTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    registrationDocument1: {
      type: Sequelize.STRING,
    },
    registrationDocument2: {
      type: Sequelize.STRING,
    },
    registrationDocument3: {
      type: Sequelize.STRING,
    },
    identityCardFront: {
      type: Sequelize.STRING,
    },
    identityCardBack: {
      type: Sequelize.STRING,
    },
    registrationBusinessName: {
      type: Sequelize.STRING,
    },
    registrationBusinessNumber: {
      type: Sequelize.STRING,
    },
    registrationOwnerName: {
      type: Sequelize.STRING,
    },
    registrationOwnerId: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: true,
  });

  return Shop;
};
