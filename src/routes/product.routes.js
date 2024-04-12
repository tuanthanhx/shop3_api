module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const products = require('../controllers/product.controller');
  const rules = require('../rules/product.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, products.findAll);
  router.post('/', rules.create, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'mainVideo', maxCount: 1 },
    { name: 'otherImages', maxCount: 9 },
  ]), products.create);
  router.delete('/:id', rules.delete, products.delete);

  app.use(`/api/${apiVersion}/products`, router);
};
