module.exports = function (sequelize, Sequelize) {
  const Variant = sequelize.define('variant', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    paranoid: false,
  });

  return Variant;
};
