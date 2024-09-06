module.exports = (app) => {
  const router = require('express').Router();
  const warehouses = require('../../controllers/seller/warehouse.controller');
  // const rules = require('../../rules/seller/seller.rules'); // TODO: Add rules later

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', warehouses.index);
  router.post('/', warehouses.create);
  router.put('/:id', warehouses.update);
  router.delete('/:id', warehouses.delete);

  app.use(`/api-seller/${apiVersion}/warehouses`, router);
};
