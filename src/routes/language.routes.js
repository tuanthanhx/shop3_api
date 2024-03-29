module.exports = (app) => {
  const router = require('express').Router();
  const languages = require('../controllers/language.controller');

  router.get('/', languages.findAll);
  router.get('/:id', languages.findOne);
  router.post('/', languages.create);
  router.put('/:id', languages.update);
  router.delete('/:id', languages.delete);

  app.use('/api/languages', router);
};
