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

db.user.belongsTo(db.language, { foreignKey: 'languageId' });
db.user.belongsTo(db.currency, { foreignKey: 'currencyId' });

db.user.hasMany(db.user_refresh_token, { onDelete: 'CASCADE' });
db.user_refresh_token.belongsTo(db.user);

db.user_verification.belongsTo(db.user, { foreignKey: 'userId' });
db.user.hasMany(db.user_verification, { foreignKey: 'userId', onDelete: 'CASCADE' });

db.user_address.belongsTo(db.country, { foreignKey: 'countryCode' });
db.country.hasMany(db.user_address, { foreignKey: 'countryCode' });

db.user.belongsTo(db.user_group, { foreignKey: 'userGroupId' });
db.user_group.hasMany(db.user, { foreignKey: 'userGroupId' });

db.user.hasOne(db.shop);
db.shop.belongsTo(db.user, { foreignKey: 'userId' });

db.shop.belongsTo(db.seller_business_type, { foreignKey: 'sellerBusinessTypeId' });

db.product.belongsTo(db.category, { foreignKey: 'categoryId' });
db.category.hasMany(db.product, { foreignKey: 'categoryId' });

db.product.belongsTo(db.brand, { foreignKey: 'brandId' });
db.brand.hasMany(db.product, { foreignKey: 'brandId' });

db.product.belongsTo(db.product_status, { foreignKey: 'productStatusId' });
db.product_status.hasMany(db.product, { foreignKey: 'productStatusId' });

db.product.hasMany(db.product_image, { as: 'productImages', onDelete: 'CASCADE' });
db.product_image.belongsTo(db.product);

db.product.hasMany(db.product_video, { as: 'productVideos', onDelete: 'CASCADE' });
db.product_video.belongsTo(db.product);

db.product.belongsTo(db.shop, { foreignKey: 'shopId' });
db.shop.hasMany(db.product, { foreignKey: 'shopId' });

db.product.hasMany(db.product_attribute, { as: 'productAttributes', onDelete: 'CASCADE' });
db.product_attribute.belongsTo(db.product);

db.product.hasMany(db.variant, { onDelete: 'CASCADE' });
db.variant.belongsTo(db.product);

db.product.hasMany(db.option, { onDelete: 'CASCADE' });
db.option.belongsTo(db.product);

db.product.hasMany(db.product_variant, { as: 'productVariants', onDelete: 'CASCADE' });
db.product_variant.belongsTo(db.product);

db.variant.hasMany(db.option);
db.option.belongsTo(db.variant);

db.product_variant.belongsToMany(db.option, { through: 'product_variants_maps' });
db.option.belongsToMany(db.product_variant, { through: 'product_variants_maps' });

db.category.belongsToMany(db.attribute, { through: 'category_attribute_maps' });
db.attribute.belongsToMany(db.category, { through: 'category_attribute_maps' });

db.attribute.hasMany(db.attribute_value, { foreignKey: 'attributeId', as: 'attributeValues' });
db.attribute_value.belongsTo(db.attribute, { foreignKey: 'attributeId' });

db.logistics_service.hasMany(db.logistics_provider);
db.logistics_provider.belongsTo(db.logistics_service);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
