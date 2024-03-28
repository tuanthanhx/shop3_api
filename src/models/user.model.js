module.exports = function (sequelize, Sequelize) {
  const User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    uuid: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
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
      type: Sequelize.DATE,
    },
    language_id: {
      type: Sequelize.INTEGER,
    },
    currency_id: {
      type: Sequelize.INTEGER,
    },
    is_phone_validated: {
      type: Sequelize.BOOLEAN,
    },
    is_email_validated: {
      type: Sequelize.BOOLEAN,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    last_login: {
      type: Sequelize.DATE,
    },
  }, {
    paranoid: true,
  });

  return User;
};
