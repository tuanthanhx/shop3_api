module.exports = (app) => {
  const router = require('express').Router();
  const brands = require('../../controllers/admin/brand.controller');
  const rules = require('../../rules/admin/brand.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, brands.index);
  router.get('/:id', rules.show, brands.show);
  router.post('/', rules.create, brands.create);
  router.put('/:id', rules.update, brands.update);
  router.delete('/:id', rules.delete, brands.delete);

  app.use(`/api-admin/${apiVersion}/brands`, router);
};
