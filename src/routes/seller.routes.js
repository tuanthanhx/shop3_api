module.exports = (app) => {
  const router = require('express').Router();
  const sellers = require('../controllers/seller.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/business_types', sellers.getBusinessTypes);

  app.use(`/api/${apiVersion}/sellers`, router);
};
