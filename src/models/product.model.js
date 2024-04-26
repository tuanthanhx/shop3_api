module.exports = function (sequelize, Sequelize) {
  const Product = sequelize.define('product', {
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
  }, {
    paranoid: false,
  });

  return Product;
};
