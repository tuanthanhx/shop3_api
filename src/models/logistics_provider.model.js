module.exports = function (sequelize, Sequelize) {
  const LogisticsProvider = sequelize.define('logistics_provider', {
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
    packageWeightMin: {
      type: Sequelize.INTEGER,
    },
    packageWeightMax: {
      type: Sequelize.INTEGER,
    },
    packageWidthMax: {
      type: Sequelize.INTEGER,
    },
    packageHeightMax: {
      type: Sequelize.INTEGER,
    },
    packageLengthMax: {
      type: Sequelize.INTEGER,
    },
    codSupported: {
      type: Sequelize.BOOLEAN,
    },
    cpSupported: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });

  return LogisticsProvider;
};
