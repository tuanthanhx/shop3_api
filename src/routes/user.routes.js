module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../controllers/user.controller.js');
  const authenticateToken = require('../middlewares/authenticate_token.middleware.js');

  // Create a new User
  router.post('/', authenticateToken, users.create);

  // Retrieve all Users
  router.get('/', authenticateToken, users.findAll);

  // // Retrieve all published Users
  // router.get('/published', users.findAllPublished);

  // // Retrieve a single Tutorial with id
  // router.get('/:id', users.findOne);

  // // Update a Tutorial with id
  // router.put('/:id', users.update);

  // // Delete a Tutorial with id
  // router.delete('/:id', users.delete);

  // // Delete all Users
  // router.delete('/', users.deleteAll);

  app.use('/api/users', router);
};
