module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const products = require('../controllers/product.controller');
  const rules = require('../rules/product.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, products.findAll);
  router.post('/', upload.fields([
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'thumbnailVideo', maxCount: 1 },
    { name: 'images', maxCount: 9 },
  ]), rules.create, products.create);
  router.put('/:id', upload.fields([
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'thumbnailVideo', maxCount: 1 },
    { name: 'images', maxCount: 9 },
  ]), rules.update, products.update);
  router.delete('/:id', rules.delete, products.delete);

  app.use(`/api/${apiVersion}/products`, router);
};
