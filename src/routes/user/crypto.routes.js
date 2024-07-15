module.exports = (app) => {
  const axios = require('axios');
  const router = require('express').Router();
  const crypto = require('../../controllers/user/crypto.controller');
  // const rules = require('../../rules/user/crypto.rules');

  require('dotenv').config();

  const apiVersion = process.env.VERSION || 'v1';

  const cryptoApi = process.env.CRYPTO_API_URL;

  const setHeaders = (req, res, next) => {
    req.headers.Authorization = `Bearer ${process.env.CRYPTO_API_KEY}`;
    next();
  };

  router.get('/ipn_callback', crypto.ipnCallback);

  app.use(`/api-user/${apiVersion}/crypto`, router);
  app.use(`/api-user/${apiVersion}/crypto/forward`, setHeaders);
  app.use(`/api-user/${apiVersion}/crypto/forward/*`, async (req, res) => {
    try {
      const url = `${cryptoApi}${req.originalUrl.replace(`/api-user/${apiVersion}/crypto/forward`, '')}`;
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
