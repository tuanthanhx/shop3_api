module.exports = function (sequelize, Sequelize) {
  return sequelize.define('product', {
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
      type: Sequelize.TEXT('long'),
    },
    categoryId: {
      type: Sequelize.INTEGER,
    },
    productStatusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    shopId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandId: {
      type: Sequelize.INTEGER,
    },
    thumbnailImage: {
      type: Sequelize.STRING,
    },
    packageWeight: {
      type: Sequelize.INTEGER,
    },
    packageWidth: {
      type: Sequelize.INTEGER,
    },
    packageHeight: {
      type: Sequelize.INTEGER,
    },
    packageLength: {
      type: Sequelize.INTEGER,
    },
    cod: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    paranoid: false,
  });
};
