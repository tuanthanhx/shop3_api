const db = require('./src/models');

db.sequelize.sync({ force: true })
  .then(() => {
    console.info('Synced DB.');
  })
  .catch((err) => {
    console.error(`Failed to sync DB: ${err.message}`);
  });
