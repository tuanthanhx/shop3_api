module.exports = function (sequelize, Sequelize) {
  const Shop = sequelize.define('shop', {
    shop_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    registration_document_1: {
      type: Sequelize.STRING,
    },
    registration_document_2: {
      type: Sequelize.STRING,
    },
    registration_document_3: {
      type: Sequelize.STRING,
    },
    identity_card_front: {
      type: Sequelize.STRING,
    },
    identity_card_back: {
      type: Sequelize.STRING,
    },
    registration_business_name: {
      type: Sequelize.STRING,
    },
    registration_business_number: {
      type: Sequelize.STRING,
    },
    registration_owner_name: {
      type: Sequelize.STRING,
    },
    registration_owner_id: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: true,
  });

  return Shop;
};
