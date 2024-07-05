module.exports = (app) => {
  const axios = require('axios');
  const router = require('express').Router();
  const coingate = require('../../controllers/user/coingate.controller');
  // const rules = require('../../rules/user/coingate.rules');

  require('dotenv').config();

  const apiVersion = process.env.VERSION || 'v1';

  const coingateApi = process.env.COINGATE_API_URL;

  const setCoinGateHeaders = (req, res, next) => {
    req.headers.Authorization = `Token ${process.env.COINGATE_API_KEY}`;
    next();
  };

  router.post('/ipn_callback', coingate.ipnCallback);

  app.use(`/api-user/${apiVersion}/coingate`, router);
  app.use(`/api-user/${apiVersion}/coingate/forward`, setCoinGateHeaders);
  app.use(`/api-user/${apiVersion}/coingate/forward/*`, async (req, res) => {
    try {
      const coinGateUrl = `${coingateApi}${req.originalUrl.replace(`/api-user/${apiVersion}/coingate/forward`, '')}`;
      const response = await axios({
        method: req.method,
        url: coinGateUrl,
        headers: { Authorization: req.headers.Authorization },
        params: req.query,
        data: req.body,
      });
      res.send(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message || 'Some error occurred' });
    }
  });
};
