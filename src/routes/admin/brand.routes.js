module.exports = (app) => {
  const router = require('express').Router();
  const brands = require('../../controllers/admin/brand.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', brands.index);
  router.get('/:id', brands.show);
  router.post('/', brands.create);
  router.put('/:id', brands.update);
  router.delete('/:id', brands.delete);

  app.use(`/api-admin/${apiVersion}/brands`, router);
};
