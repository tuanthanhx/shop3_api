module.exports = function (sequelize, Sequelize) {
  const User = sequelize.define('user', {
    fullName: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.BOOLEAN,
    },
    avatar2: {
      type: Sequelize.BOOLEAN,
    },
    avatar3: {
      type: Sequelize.BOOLEAN,
    },
    avatar4: {
      type: Sequelize.BOOLEAN,
    },
    avatar5: {
      type: Sequelize.BOOLEAN,
    },
    avatar6: {
      type: Sequelize.BOOLEAN,
    },
  });

  return User;
};
