module.exports = (app) => {
  const router = require('express').Router();
  const brands = require('../controllers/brand.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', brands.findAll);

  app.use(`/api/${apiVersion}/brands`, router);
};
