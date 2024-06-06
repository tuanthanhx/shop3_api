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
  logging: false, // env === 'development' ? console.log : false,
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

db.country.hasMany(db.user_address, { foreignKey: 'countryCode' });
db.user_address.belongsTo(db.country, { foreignKey: 'countryCode' });

db.user.hasMany(db.user_address, { onDelete: 'CASCADE' });
db.user_address.belongsTo(db.user);

db.user.belongsTo(db.user_group);
db.user_group.hasMany(db.user);

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

db.variant.hasMany(db.option, { onDelete: 'CASCADE' });
db.option.belongsTo(db.variant);

db.product_variant.belongsToMany(db.option, { through: 'product_variants_maps' });
db.option.belongsToMany(db.product_variant, { through: 'product_variants_maps' });

db.category.belongsToMany(db.attribute, { through: 'category_attribute_maps' });
db.attribute.belongsToMany(db.category, { through: 'category_attribute_maps' });

db.attribute.hasMany(db.attribute_value, { foreignKey: 'attributeId', as: 'attributeValues', onDelete: 'CASCADE' });
db.attribute_value.belongsTo(db.attribute, { foreignKey: 'attributeId' });

db.logistics_service.belongsToMany(db.shop, { through: 'logistics_services_shops_maps' });
db.shop.belongsToMany(db.logistics_service, { through: 'logistics_services_shops_maps', as: 'logisticsServices' });

db.logistics_service.belongsToMany(db.product, { through: 'logistics_services_products_maps' });
db.product.belongsToMany(db.logistics_service, { through: 'logistics_services_products_maps', as: 'logisticsServices' });

db.logistics_provider.belongsToMany(db.logistics_service, { through: 'logistics_services_providers_maps' });
db.logistics_service.belongsToMany(db.logistics_provider, { through: 'logistics_services_providers_maps', as: 'logisticsProviders' });

db.logistics_provider_option.belongsTo(db.logistics_service, { as: 'logisticsService' });
db.logistics_service.hasMany(db.logistics_provider_option);

db.logistics_provider_option.belongsTo(db.logistics_provider, { as: 'logisticsProvider' });
db.logistics_provider.hasMany(db.logistics_provider_option, { as: 'logisticsProvidersOptions' });

// Relationship between cart, user, product, product_variant

db.user.hasMany(db.cart, { onDelete: 'CASCADE' });
db.cart.belongsTo(db.user);

db.shop.hasMany(db.cart, { onDelete: 'CASCADE' });
db.cart.belongsTo(db.shop);

db.product.hasMany(db.cart, { onDelete: 'CASCADE' });
db.cart.belongsTo(db.product);

db.product_variant.hasMany(db.cart, { onDelete: 'CASCADE' });
db.cart.belongsTo(db.product_variant, { as: 'productVariant' });

// Relationship between payment_method, payment_method_type, user

db.user.hasMany(db.payment_method, { onDelete: 'CASCADE' });
db.payment_method.belongsTo(db.user);

db.payment_method_type.hasMany(db.payment_method, { onDelete: 'CASCADE' });
db.payment_method.belongsTo(db.payment_method_type);

db.payment_method.hasOne(db.payment_method_card, { onDelete: 'CASCADE' });
db.payment_method_card.belongsTo(db.payment_method);

db.payment_method.hasOne(db.payment_method_paypal, { onDelete: 'CASCADE' });
db.payment_method_paypal.belongsTo(db.payment_method);

db.payment_method.hasOne(db.payment_method_cryptocurrency, { onDelete: 'CASCADE' });
db.payment_method_cryptocurrency.belongsTo(db.payment_method);

db.payment_method.hasOne(db.payment_method_online, { onDelete: 'CASCADE' });
db.payment_method_online.belongsTo(db.payment_method);

// Relationship of order, order_item

db.user.hasMany(db.order, { onDelete: 'CASCADE' });
db.order.belongsTo(db.user);

db.shop.hasMany(db.order, { onDelete: 'CASCADE' });
db.order.belongsTo(db.shop);

db.order_status.hasMany(db.order);
db.order.belongsTo(db.order_status, { as: 'orderStatus' });

db.order.hasMany(db.order_item, { as: 'orderItems', onDelete: 'CASCADE' });
db.order_item.belongsTo(db.order);

db.product.hasMany(db.order_item, { onDelete: 'CASCADE' });
db.order_item.belongsTo(db.product);

// Relationship of order_payment

db.order.hasOne(db.order_payment, { foreignKey: 'orderId', as: 'orderPayment', onDelete: 'CASCADE' });
db.order_payment.belongsTo(db.order, { foreignKey: 'orderId', as: 'orderPayment' });
db.order_payment.belongsTo(db.user);
db.order_payment.belongsTo(db.shop);

// Relationship of order_shipping

db.order.hasOne(db.order_shipping, { foreignKey: 'orderId', as: 'orderShipping', onDelete: 'CASCADE' });
db.order_shipping.belongsTo(db.order, { foreignKey: 'orderId', as: 'orderShipping' });
db.order_shipping.belongsTo(db.user);
db.order_shipping.belongsTo(db.shop);

// Relationship of order_tracking

db.order.hasMany(db.order_tracking, { foreignKey: 'orderId', as: 'orderTrackings', onDelete: 'CASCADE' });
db.order_tracking.belongsTo(db.order, { foreignKey: 'orderId', as: 'orderTrackings' });

db.user.hasMany(db.order_tracking, { foreignKey: 'userId', as: 'orderTrackings' });
db.order_shipping.belongsTo(db.user, { foreignKey: 'userId' });

// Relationship of review

db.order_item.hasOne(db.review, { foreignKey: 'orderItemId', onDelete: 'CASCADE' });
db.review.belongsTo(db.order_item, { foreignKey: 'orderItemId', as: 'orderItem', onDelete: 'CASCADE' });
db.review.belongsTo(db.order, { foreignKey: 'orderId', onDelete: 'CASCADE' });
db.review.belongsTo(db.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.review.belongsTo(db.shop, { foreignKey: 'shopId', onDelete: 'CASCADE' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
