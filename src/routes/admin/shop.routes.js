module.exports = (app) => {
  const router = require('express').Router();
  const shops = require('../../controllers/admin/shop.controller');
  const rules = require('../../rules/admin/shop.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, shops.index);
  router.get('/:id', rules.show, shops.show);
  router.post('/:id/verify', rules.verify, shops.verify);
  router.post('/:id/activate', rules.activate, shops.activate);
  router.post('/:id/deactivate', rules.deactivate, shops.deactivate);

  app.use(`/api-admin/${apiVersion}/shops`, router);
};
