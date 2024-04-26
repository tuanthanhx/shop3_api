module.exports = function (sequelize, Sequelize) {
  const AttributeValue = sequelize.define('attribute_value', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });

  return AttributeValue;
};
