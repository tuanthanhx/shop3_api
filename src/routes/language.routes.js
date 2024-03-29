module.exports = (app) => {
  const router = require('express').Router();
  const languages = require('../controllers/language.controller.js');
  const authenticateToken = require('../middlewares/authenticate_token.middleware.js');

  router.get('/', authenticateToken, languages.findAll);
  router.get('/:id', authenticateToken, languages.findOne);
  router.post('/', authenticateToken, languages.create);
  router.put('/:id', authenticateToken, languages.update);
  router.delete('/:id', authenticateToken, languages.delete);

  app.use('/api/languages', router);
};
