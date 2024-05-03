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
    // packageWeightMin: {
    //   type: Sequelize.INTEGER,
    // },
    // packageWeightMax: {
    //   type: Sequelize.INTEGER,
    // },
    // packageWidthMax: {
    //   type: Sequelize.INTEGER,
    // },
    // packageHeightMax: {
    //   type: Sequelize.INTEGER,
    // },
    // packageLengthMax: {
    //   type: Sequelize.INTEGER,
    // },
    // codSupported: {
    //   type: Sequelize.BOOLEAN,
    // },
    // cpSupported: {
    //   type: Sequelize.BOOLEAN,
    // },
  }, {
    paranoid: false,
  });
};
