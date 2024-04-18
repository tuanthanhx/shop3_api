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
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    sku: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    productStatusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    mainImageId: {
      type: Sequelize.INTEGER,
    },
    mainVideoId: {
      type: Sequelize.INTEGER,
    },
    shopId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    paranoid: true,
  });

  return Product;
};
