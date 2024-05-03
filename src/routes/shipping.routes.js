module.exports = (app) => {
  const router = require('express').Router();
  const shippings = require('../controllers/shipping.controller');
  // const rules = require('../rules/shipping.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/services', shippings.getServices);

  app.use(`/api/${apiVersion}/shipping`, router);
};
