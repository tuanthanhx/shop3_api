module.exports = (app) => {
  const router = require('express').Router();
  const brands = require('../../controllers/seller/brand.controller');
  const rules = require('../../rules/seller/brand.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, brands.index);
  router.post('/', rules.create, brands.create);

  app.use(`/api-seller/${apiVersion}/brands`, router);
};
