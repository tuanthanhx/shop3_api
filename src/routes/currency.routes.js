module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../controllers/currency.controller.js');
  const authenticateToken = require('../middlewares/authenticate_token.middleware.js');

  router.get('/', authenticateToken, currencies.findAll);
  router.get('/:id', authenticateToken, currencies.findOne);
  router.post('/', authenticateToken, currencies.create);
  router.put('/:id', authenticateToken, currencies.update);
  router.delete('/:id', authenticateToken, currencies.delete);

  app.use('/api/currencies', router);
};
