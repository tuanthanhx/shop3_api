module.exports = (app) => {
  const axios = require('axios');
  const router = require('express').Router();
  const nowpayments = require('../../controllers/user/nowpayment.controller');
  // const rules = require('../../rules/user/nowpayment.rules');

  require('dotenv').config();

  const apiVersion = process.env.VERSION || 'v1';

  const nowpaymentsApi = process.env.NOWPAYMENTS_API_URL;

  const setNowPaymentsHeaders = (req, res, next) => {
    req.headers['x-api-key'] = process.env.NOWPAYMENTS_API_KEY;
    next();
  };

  router.post('/ipn_callback', nowpayments.ipnCallback);

  app.use(`/api-user/${apiVersion}/nowpayments`, router);
  app.use(`/api-user/${apiVersion}/nowpayments/forward`, setNowPaymentsHeaders);
  app.use(`/api-user/${apiVersion}/nowpayments/forward/*`, async (req, res) => {
    try {
      const nowPaymentsUrl = `${nowpaymentsApi}${req.originalUrl.replace(`/api-user/${apiVersion}/nowpayments/forward`, '')}`;
      const response = await axios({
        method: req.method,
        url: nowPaymentsUrl,
        headers: { 'x-api-key': req.headers['x-api-key'] },
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
