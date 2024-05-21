module.exports = (app) => {
  const router = require('express').Router();
  const userGroups = require('../../controllers/admin/user_group.controller');
  const rules = require('../../rules/admin/user_group.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, userGroups.index);

  app.use(`/api-admin/${apiVersion}/user_groups`, router);
};
