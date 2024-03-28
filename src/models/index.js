const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const process = require('process');
const dbConfigs = require('../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = dbConfigs[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: env === 'development' ? console.log : false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  define: {
    underscored: true,
  },
});

const db = {};

fs
  .readdirSync(__dirname)
  .filter((file) => (file.endsWith('.model.js')))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.user.belongsTo(db.language, { foreignKey: 'language_id' });
db.user.belongsTo(db.currency, { foreignKey: 'currency_id' });

db.user_verification.belongsTo(db.user, { foreignKey: 'user_id' });
db.user.hasMany(db.user_verification, { foreignKey: 'user_id' });

db.user_address.belongsTo(db.country, { foreignKey: 'country_code' });
db.country.hasMany(db.user_address, { foreignKey: 'country_code' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
