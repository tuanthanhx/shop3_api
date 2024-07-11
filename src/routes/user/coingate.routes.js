module.exports = (app) => {
  const axios = require('axios');
  const router = require('express').Router();
  const coingate = require('../../controllers/user/coingate.controller');
  // const rules = require('../../rules/user/coingate.rules');

  require('dotenv').config();

  const apiVersion = process.env.VERSION || 'v1';

  const coingateApi = process.env.COINGATE_API_URL;

  const setHeaders = (req, res, next) => {
    req.headers.Authorization = `Token ${process.env.COINGATE_API_KEY}`;
    next();
  };

  router.post('/ipn_callback', coingate.ipnCallback);

  app.use(`/api-user/${apiVersion}/coingate`, router);
  app.use(`/api-user/${apiVersion}/coingate/forward`, setHeaders);
  app.use(`/api-user/${apiVersion}/coingate/forward/*`, async (req, res) => {
    try {
      const url = `${coingateApi}${req.originalUrl.replace(`/api-user/${apiVersion}/coingate/forward`, '')}`;
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
