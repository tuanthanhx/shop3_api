module.exports = (app) => {
  const router = require('express').Router();
  const sellerBusinessType = require('../controllers/seller_business_type.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', sellerBusinessType.findAll);

  app.use(`/api/${apiVersion}/seller/business_type`, router);
};
