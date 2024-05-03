module.exports = function (sequelize, Sequelize) {
  const LogisticsService = sequelize.define('logistics_service', {
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
  }, {
    paranoid: false,
  });

  return LogisticsService;
};
