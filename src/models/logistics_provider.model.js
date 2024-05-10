module.exports = function (sequelize, Sequelize) {
  return sequelize.define('logistics_provider', {
    uniqueId: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    logo: {
      type: Sequelize.STRING,
    },
    isEnabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  }, {
    paranoid: false,
  });
};
