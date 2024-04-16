const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const db = require('./src/models');

const { authenticateToken } = require('./src/middlewares/authenticate_token');
const { handleQueries, validateRules } = require('./src/middlewares/validators');

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

let corsOptions = {};
if (env !== 'development') {
  corsOptions = {
    origin: process.env.ALLOWED_ORIGINS.split(','),
  };
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: process.env.TITLE,
      version: '1.0.0',
      description: `Documentation for ${process.env.TITLE}`,
    },
    servers: [
      {
        url: env === 'development' ? `${process.env.APP_URL_DEV}/${process.env.VERSION}` : `${process.env.APP_URL_PROD}/${process.env.VERSION}`,
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authenticateToken);
app.use([handleQueries, validateRules]);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification, { customSiteTitle: `${process.env.TITLE} Docs` }));

db.sequelize.sync()
  .then(() => {
    if (env === 'development') {
      console.info('Synced DB.');
    }
  })
  .catch((err) => {
    console.error(`Failed to sync DB: ${err.message}`);
  });

app.get('/', (req, res) => {
  res.json({
    message: process.env.TITLE,
    version: process.env.VERSION,
  });
});

const routesDir = `${__dirname}/src/routes`;
fs.readdirSync(routesDir)
  .filter((file) => file.endsWith('.routes.js'))
  .forEach((file) => {
    const routePath = path.join(routesDir, file);
    const routes = require(routePath);
    routes(app);
  });

const startServer = () => new Promise((resolve) => {
  const server = app.listen(port, () => {
    if (env === 'development' || env === 'production') {
      console.info(`Server is running by ${env} mode on port ${port}`);
    }
    resolve(server);
  });
});

const closeServer = (server) => new Promise((resolve, reject) => {
  server.close((err) => {
    if (err) {
      reject(err);
    } else {
      if (env === 'development' || env === 'production') {
        console.info('Server closed');
      }
      resolve();
    }
  });
});

if (env === 'development' || env === 'production') {
  startServer();
}

module.exports = { app, startServer, closeServer };
