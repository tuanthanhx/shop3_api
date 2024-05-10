module.exports = (app) => {
  const router = require('express').Router();
  const brands = require('../../controllers/admin/brand.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', brands.index);
  router.post('/', brands.create);

  app.use(`/api-seller/${apiVersion}/brands`, router);
};
