npm i
npm run dev
npm run seed:dev

OR

cd src
NODE_ENV=production npx sequelize db:seed --seed 20240328094606-add_languages.js
NODE_ENV=production npx sequelize db:seed --seed 20240328094615-add_currencies.js
NODE_ENV=production npx sequelize db:seed --seed 20240328173146-add_countries.js
NODE_ENV=production npx sequelize db:seed --seed 20240409170330-add_sellers_business_types.js
NODE_ENV=production npx sequelize db:seed --seed 20240412141602-add_categories.js
NODE_ENV=production npx sequelize db:seed --seed 20240412141602-add_news_categories.js
NODE_ENV=production npx sequelize db:seed --seed 20240412154951-add_user_groups.js
NODE_ENV=production npx sequelize db:seed --seed 20240412154955-add_payment_method_types.js
NODE_ENV=production npx sequelize db:seed --seed 20240412163634-add_product_statuses.js
NODE_ENV=production npx sequelize db:seed --seed 20240423103941-add_brands.js
NODE_ENV=production npx sequelize db:seed --seed 20240426073727-add_attributes.js
NODE_ENV=production npx sequelize db:seed --seed 20240503104630-add_logistics_services.js
NODE_ENV=production npx sequelize db:seed --seed 20240503111032-add_logistics_providers.js
NODE_ENV=production npx sequelize db:seed --seed 20240503153321-add_logistics_providers_options.js
NODE_ENV=production npx sequelize db:seed --seed 20240503164651-add_logistics_services__providers_maps.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090930-add_test_user_admin.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090935-add_test_user_external.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090940-add_test_user_seller.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090941-add_test_user_registered.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090945-add_test_shops.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090950-add_test_products.js
NODE_ENV=production npx sequelize db:seed --seed 20240602000000-add_order_statuses.js
NODE_ENV=production npx sequelize db:seed --seed 20240905000000-add_wallet_types.js
NODE_ENV=production npx sequelize db:seed --seed 20240905000001-add_wallets.js
NODE_ENV=production npx sequelize db:seed --seed 20240907000001-add_withdrawal_statuses.js


# MIGRATION

npx sequelize-cli db:migrate --env production

OR sepecified file:

npx sequelize-cli db:migrate --to 20240530185717-add-wallet-address-to-user.js --env production
npx sequelize-cli db:migrate --to 20240530185720-add-shop-id-to-cart.js --env production
npx sequelize-cli db:migrate --to 20240530185720-add-columns-to-products.js --env production

npx sequelize-cli db:migrate --to 20240530185720-add-country-code-to-users.js --env production
// UPDATE `users` SET `countryCode` = 'cn';

npx sequelize-cli db:migrate --to 20240904042204-add_columns_to_user_address.js --env production
npx sequelize-cli db:migrate --to 20240905000001-add_columns_to_order.js --env production

npx sequelize-cli db:migrate --to 20240915000001-add_referrer_id_to_user.js --env production
npx sequelize-cli db:migrate --to 20240916000001-remove_referrer_id_constant.js --env production
npx sequelize-cli db:migrate --to 20240918000001-add_columns_to_warehouse.js --env production
npx sequelize-cli db:migrate --to 20240918000002-add_columns_to_user_address.js --env production
npx sequelize-cli db:migrate --to 20240918000003-add_columns_to_order_shipping.js --env production
npx sequelize-cli db:migrate --to 20240930000010-add_columns_to_order_shipping.js --env production

===========


TODO:

Validate variants and Productvariants:
-- check: no duplicated name
-- check: no duplicated options in same variant


TEST:

  npm run test
  npm run test -- test/20240416114200_register.test.js
