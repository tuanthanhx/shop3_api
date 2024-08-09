module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const files = require('../../controllers/seller/file.controller');
  const rules = require('../../rules/seller/file.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, files.index);
  router.post('/', upload.fields([
    { name: 'file', maxCount: 1 },
  ]), rules.create, files.create);
  router.delete('/:id', rules.delete, files.delete);

  app.use(`/api-admin/${apiVersion}/files`, router);
};
