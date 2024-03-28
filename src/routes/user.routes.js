module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../controllers/user.controller.js');

  // Create a new User
  router.post('/', users.create);

  // Retrieve all Users
  router.get('/', users.findAll);

  // // Retrieve all published Tutorials
  // router.get('/published', users.findAllPublished);

  // // Retrieve a single Tutorial with id
  // router.get('/:id', users.findOne);

  // // Update a Tutorial with id
  // router.put('/:id', users.update);

  // // Delete a Tutorial with id
  // router.delete('/:id', users.delete);

  // // Delete all Tutorials
  // router.delete('/', users.deleteAll);

  app.use('/api/users', router);
};
