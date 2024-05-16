module.exports = (app) => {
  const router = require('express').Router();
  const shops = require('../../controllers/admin/shop.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', shops.index);
  router.get('/:id', shops.show);
  router.post('/:id/verify', shops.verify);
  router.post('/:id/activate', shops.activate);
  router.post('/:id/deactivate', shops.deactivate);

  app.use(`/api-admin/${apiVersion}/shops`, router);
};
