module.exports = function (sequelize, Sequelize) {
  const Tutorial = sequelize.define('tutorial', {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    published: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: true,
  });

  return Tutorial;
};
