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
