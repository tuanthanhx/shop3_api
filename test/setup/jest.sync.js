const db = require('../../src/models');

db.sequelize.sync({ force: true })
  .then(() => {
    console.info('Synced DB.');
    return db.sequelize.close();
  })
  .then(() => {
    console.info('Database connection closed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`Failed to sync DB: ${err.message}`);
    process.exit(1);
  });
