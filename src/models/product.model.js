module.exports = function (sequelize, Sequelize) {
  const Product = sequelize.define('product', {
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
  }, {
    paranoid: true,
  });

  return Product;
};
