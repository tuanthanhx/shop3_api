module.exports = function (sequelize, Sequelize) {
  return sequelize.define('logistics_provider_option', {
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
};
