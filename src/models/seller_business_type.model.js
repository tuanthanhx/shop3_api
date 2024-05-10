module.exports = function (sequelize, Sequelize) {
  return sequelize.define('seller_business_type', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });
};
