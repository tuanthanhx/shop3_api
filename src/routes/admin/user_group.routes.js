module.exports = (app) => {
  const router = require('express').Router();
  const userGroups = require('../../controllers/admin/user_group.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', userGroups.index);

  app.use(`/api-admin/${apiVersion}/user_groups`, router);
};
