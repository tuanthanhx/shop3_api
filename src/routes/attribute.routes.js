module.exports = (app) => {
  const router = require('express').Router();
  const attributes = require('../controllers/attribute.controller');
  // const rules = require('../rules/seller.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', attributes.getAll);

  app.use(`/api/${apiVersion}/attributes`, router);
};
