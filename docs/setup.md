npm i
npm run dev
npm run seed
OR

cd src
npx sequelize db:seed --seed 20240328094606-add_languages.js
npx sequelize db:seed --seed 20240328094615-add_currencies.js
npx sequelize db:seed --seed 20240328173146-add_countries.js
npx sequelize db:seed --seed 20240409170330-add_sellers_business_types.js
npx sequelize db:seed --seed 20240412141602-add_category.js
npx sequelize db:seed --seed 20240412154951-add_user_groups.js
npx sequelize db:seed --seed 20240412163634-add_product_statuses.js
npx sequelize db:seed --seed 20240423103941-add_brands.js
npx sequelize db:seed --seed 20240426073727-add_attributes.js
npx sequelize db:seed --seed 20240503104630-add_logistics_services.js
npx sequelize db:seed --seed 20240503111032-add_logistics_providers.js
npx sequelize db:seed --seed 20240503153321-add_logistics_providers_options.js
npx sequelize db:seed --seed 20240503164651-add_logistics_services__providers_maps.js

NODE_ENV=production npx sequelize db:seed --seed 20240523090930-add_test_user_admin.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090935-add_test_user_external.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090940-add_test_user_register.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090945-add_test_shops.js
NODE_ENV=production npx sequelize db:seed --seed 20240523090950-add_test_products.js

# MIGRATION

npx sequelize-cli db:migrate --env production

===========



TODO:

Validate variants and Productvariants:
-- check: no duplicated name
-- check: no duplicated options in same variant



SEQUELIZE COMMANDS:

  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
x sequelize db:seed                           Run specified seeder (--seed something)
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file
  sequelize migration:create                  Generates a new migration file
  sequelize model:generate                    Generates a model and its migration
  sequelize model:create                      Generates a model and its migration
x sequelize seed:generate                     Generates a new seed file (--name something)
  sequelize seed:create                       Generates a new seed file


TEST:

  npm run test
  npm run test -- test/20240416114200_register.test.js
