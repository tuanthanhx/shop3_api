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
    language_id: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    currency_id: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    is_phone_validated: {
      type: Sequelize.BOOLEAN,
    },
    is_email_validated: {
      type: Sequelize.BOOLEAN,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: Sequelize.DATE,
    },
  }, {
    paranoid: true,
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
      },
    },
    instanceMethods: {
      generateHash(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
      },
      validPassword(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  });

  return User;
};
