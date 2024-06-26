const crypto = require('crypto');
const logger = require('../../utils/logger');

require('dotenv').config();

const notificationsKey = process.env.NOWPAYMENTS_API_IPN;

const sortObject = (obj) => Object.keys(obj).sort().reduce(
  (result, key) => {
    result[key] = (obj[key] && typeof obj[key] === 'object') ? sortObject(obj[key]) : obj[key];
    return result;
  },
  {},
);

exports.ipnCallback = async (req, res) => {
  try {
    // Extract the signature from the request headers
    const receivedSignature = req.get('x-nowpayments-sig');

    // Sort and stringify the request body parameters
    const sortedParams = sortObject(req.body);
    const stringifiedParams = JSON.stringify(sortedParams);

    // Calculate HMAC with SHA-512 using the IPN secret key
    const hmac = crypto.createHmac('sha512', notificationsKey);
    hmac.update(stringifiedParams);
    const calculatedSignature = hmac.digest('hex');

    // Compare the received signature with the calculated one
    if (receivedSignature === calculatedSignature) {
      // Signatures match - request is verified
      logger.info('IPN callback verified:', sortedParams);
      console.log('IPN callback verified:', sortedParams);

      // Handle the IPN data here, update your database, trigger actions, etc.

      // Respond with a success status
      res.status(200).send('IPN callback received and verified.');
    } else {
      // Signatures do not match - potential security issue
      logger.error('IPN callback signature mismatch:', receivedSignature, calculatedSignature);
      console.error('IPN callback signature mismatch:', receivedSignature, calculatedSignature);

      // Respond with an error status
      res.status(400).send('IPN callback signature mismatch.');
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
