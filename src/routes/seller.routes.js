module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const sellers = require('../controllers/seller.controller');
  const rules = require('../rules/seller.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/business_types', sellers.getBusinessTypes);
  router.post('/create_shop', upload.array('files'), rules.createShop, sellers.createShop);

  app.use(`/api/${apiVersion}/sellers`, router);
};
