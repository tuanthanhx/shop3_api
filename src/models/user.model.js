module.exports = function (sequelize, Sequelize) {
  const bcrypt = require('bcrypt');
  const User = sequelize.define('user', {
    uuid: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.INTEGER,
    },
    dob: {
      type: Sequelize.DATEONLY,
    },
    countryCode: {
      type: Sequelize.STRING(2),
    },
    languageId: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    currencyId: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    subscribeMailingList: {
      type: Sequelize.BOOLEAN,
    },
    isPhoneValidated: {
      type: Sequelize.BOOLEAN,
    },
    isEmailValidated: {
      type: Sequelize.BOOLEAN,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: Sequelize.DATE,
    },
    walletAddress: {
      type: Sequelize.STRING,
    },
  }, {
    paranoid: false,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
      },
      afterCreate: (user) => {
        delete user.dataValues.password;
      },
      afterUpdate: (user) => {
        delete user.dataValues.password;
      },
    },
  });

  User.prototype.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
