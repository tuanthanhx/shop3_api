module.exports = (app) => {
  const router = require('express').Router();
  const brands = require('../controllers/brand.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', brands.findAll);
  router.post('/', brands.create);

  app.use(`/api/${apiVersion}/brands`, router);
};
