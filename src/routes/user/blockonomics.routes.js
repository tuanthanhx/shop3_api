module.exports = (app) => {
  const axios = require('axios');
  const router = require('express').Router();
  const blockonomics = require('../../controllers/user/blockonomics.controller');
  // const rules = require('../../rules/user/blockonomics.rules');

  require('dotenv').config();

  const apiVersion = process.env.VERSION || 'v1';

  const blockonomicsApi = process.env.BLOCKONOMICS_API_URL;

  const setHeaders = (req, res, next) => {
    req.headers.Authorization = `Bearer ${process.env.BLOCKONOMICS_API_KEY}`;
    next();
  };

  router.get('/ipn_callback', blockonomics.ipnCallback);

  app.use(`/api-user/${apiVersion}/blockonomics`, router);
  app.use(`/api-user/${apiVersion}/blockonomics/forward`, setHeaders);
  app.use(`/api-user/${apiVersion}/blockonomics/forward/*`, async (req, res) => {
    try {
      const url = `${blockonomicsApi}${req.originalUrl.replace(`/api-user/${apiVersion}/blockonomics/forward`, '')}`;
      const config = {
        method: req.method,
        url,
        headers: { Authorization: req.headers.Authorization },
      };
      if (Object.keys(req.query).length) {
        config.params = req.query;
      }
      if (Object.keys(req.body).length) {
        config.data = req.body;
      }
      const response = await axios(config);
      res.send(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message || 'Some error occurred' });
    }
  });
};
