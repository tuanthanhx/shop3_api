module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../controllers/user.controller.js');
  const authenticateToken = require('../middlewares/authenticate_token.middleware.js');

  router.get('/', authenticateToken, users.findAll);
  router.get('/:id', authenticateToken, users.findOne);
  router.post('/', authenticateToken, users.create);
  router.put('/:id', authenticateToken, users.update);
  router.delete('/:id', authenticateToken, users.delete);

  app.use('/api/users', router);
};
