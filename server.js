const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const db = require('./src/models');

require('dotenv').config();

let corsOptions = {};
if (process.env.NODE_ENV === 'production') {
  corsOptions = {
    origin: process.env.ALLOWED_ORIGINS.split(','),
  };
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shop3 API',
      version: '1.0.0',
      description: 'Documentation for Shop3 API.',
    },
    servers: [
      {
        url: 'http://127.0.0.1:3000/v1',
        description: 'Test Server',
      },
      {
        url: 'https://api.shop3.com',
        description: 'Production Server',
      },
    ],
  },
  apis: ['./docs/api.yaml'],
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification, { customSiteTitle: 'Shop3 API Docs' }));

db.sequelize.sync()
  .then(() => {
    console.info('Synced DB.');
  })
  .catch((err) => {
    console.error(`Failed to sync DB: ${err.message}`);
  });

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Shop3 API.' });
});

const routesDir = `${__dirname}/src/routes`;
fs.readdirSync(routesDir)
  .filter((file) => file.endsWith('.routes.js'))
  .forEach((file) => {
    const routePath = path.join(routesDir, file);
    const routes = require(routePath);
    routes(app);
  });

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
app.listen(PORT, () => {
  console.info(`Server is running with ${NODE_ENV} mode on port ${PORT}.`);
});
