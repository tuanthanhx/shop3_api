module.exports = (app) => {
  const router = require('express').Router();
  const shops = require('../../controllers/common/shop.controller');
  const rules = require('../../rules/common/shop.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, shops.index);
  router.get('/:id', rules.show, shops.show);

  app.use(`/api-common/${apiVersion}/shops`, router);
};
