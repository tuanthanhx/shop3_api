const express = require('express');
const bodyParser = require('body-parser');
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const logger = require('./src/utils/logger');
const morganMiddleware = require('./src/middlewares/morgan');
const { authenticateToken } = require('./src/middlewares/authenticate_token');
const { handleQueries, validateRules } = require('./src/middlewares/validators');
const db = require('./src/models');

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;
const baseUrl = env === 'production' ? process.env.APP_URL_PROD : process.env.APP_URL_DEV;

let corsOptions = {};
if (env === 'production' && process.env.ALLOWED_ORIGINS) {
  corsOptions = {
    origin: process.env.ALLOWED_ORIGINS.split(','),
  };
}

const app = express();

app.use(helmet());
app.use(morganMiddleware);
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParserErrorHandler());
app.use(authenticateToken);
app.use([handleQueries, validateRules]);

const customCssPath = path.join(__dirname, 'docs/theme.css');
let customCss = '';
try {
  customCss = fs.readFileSync(customCssPath, 'utf8');
} catch (err) {
  console.error('Error reading custom CSS file:', err);
}

const options = {
  explorer: true,
  customCss,
  swaggerOptions: {
    validatorUrl: null,
    urls: [
      {
        url: `${baseUrl}/docs/api_common.yaml`,
        name: 'Common',
      },
      {
        url: `${baseUrl}/docs/api_admin.yaml`,
        name: 'Administrator',
      },
      {
        url: `${baseUrl}/docs/api_seller.yaml`,
        name: 'Seller',
      },
      {
        url: `${baseUrl}/docs/api_external.yaml`,
        name: 'External',
      },
      {
        url: `${baseUrl}/docs/api_user.yaml`,
        name: 'User',
      },
      {
        url: `${baseUrl}/docs/api_public.yaml`,
        name: 'Public',
      },
    ],
  },
};

app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

db.sequelize.sync()
  .then(() => {
    if (env !== 'test') {
      logger.info('Synced DB.');
    }
  })
  .catch((err) => {
    logger.error(`Failed to sync DB: ${err.message}`);
  });

app.get('/', (req, res) => {
  res.json({
    message: process.env.TITLE,
    version: process.env.VERSION,
  });
});

const loadRoutes = (directory) => {
  const items = fs.readdirSync(directory, { withFileTypes: true });
  items.forEach((item) => {
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      loadRoutes(itemPath);
    } else if (item.name.endsWith('.routes.js')) {
      const routes = require(itemPath);
      routes(app);
    }
  });
};

const routesDir = path.join(__dirname, 'src/routes');
loadRoutes(routesDir);

const startServer = () => new Promise((resolve) => {
  const listenCallback = (server) => {
    if (env !== 'test') {
      logger.info(`Server is running by ${env} mode on port ${port}`);
    }
    resolve(server);
  };
  const server = app.listen(port, () => listenCallback(server));
});

const closeServer = (server) => new Promise((resolve, reject) => {
  server.close((err) => {
    if (err) {
      reject(err);
    } else {
      if (env !== 'test') {
        logger.info('Server closed');
      }
      resolve();
    }
  });
});

if (env === 'development' || env === 'production') {
  startServer();
}

module.exports = { app, startServer, closeServer };
