module.exports = function (sequelize, Sequelize) {
  return sequelize.define('logistics_service', {
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
    isEnabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  }, {
    paranoid: false,
  });
};
