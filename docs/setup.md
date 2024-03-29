npm i
npm run dev
cd src
npx sequelize db:seed --seed 20240328094606-add_languages.js
npx sequelize db:seed --seed 20240328094615-add_currencies.js
npx sequelize db:seed --seed 20240328173146-add_countries.js
