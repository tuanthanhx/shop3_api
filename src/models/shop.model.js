module.exports = function (sequelize, Sequelize) {
  return sequelize.define('shop', {
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
    householdBusinessRegistrationDocument1: {
      type: Sequelize.STRING,
    },
    householdBusinessRegistrationDocument2: {
      type: Sequelize.STRING,
    },
    householdBusinessRegistrationDocument3: {
      type: Sequelize.STRING,
    },
    householdBusinessName: {
      type: Sequelize.STRING,
    },
    householdBusinessRegistrationNumber: {
      type: Sequelize.STRING,
    },
    householdBusinessOwnerName: {
      type: Sequelize.STRING,
    },
    householdBusinessOwnerIdNumber: {
      type: Sequelize.STRING,
    },
    individualIdentityCardFront: {
      type: Sequelize.STRING,
    },
    individualIdentityCardBack: {
      type: Sequelize.STRING,
    },
    individualIdentityCardNumber: {
      type: Sequelize.STRING,
    },
    individualBusinessOwnerName: {
      type: Sequelize.STRING,
    },
    individualOwnerDob: {
      type: Sequelize.STRING,
    },
    individualResidentialAddress: {
      type: Sequelize.STRING,
    },
    individualProductCategoryId: {
      type: Sequelize.INTEGER,
    },
    corporateCompanyRegistrationDocument1: {
      type: Sequelize.STRING,
    },
    corporateCompanyRegistrationDocument2: {
      type: Sequelize.STRING,
    },
    corporateCompanyRegistrationDocument3: {
      type: Sequelize.STRING,
    },
    corporateCompanyName: {
      type: Sequelize.STRING,
    },
    corporateEnterpriseCodeNumber: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    subscribeMailingList: {
      type: Sequelize.BOOLEAN,
    },
    isSubmitted: {
      type: Sequelize.BOOLEAN,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  }, {
    paranoid: false,
  });
};
