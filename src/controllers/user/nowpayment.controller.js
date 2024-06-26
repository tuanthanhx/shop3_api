const crypto = require('crypto');
const db = require('../../models');
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

      const orderId = parseInt(sortedParams.order_id, 10);

      const order = await db.order.findOne({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        res.status(404).send({
          message: 'Order not found',
        });
        return;
      }

      // if (![1, 2, 4].includes(order.orderStatusId)) {
      //   res.status(400).send({
      //     message: 'Order is not ready to be paid',
      //   });
      //   return;
      // }

      const orderPayment = await order.getOrderPayment();

      if (!orderPayment) {
        res.status(404).send({
          message: 'Order payment not found',
        });
        return;
      }

      // if (orderPayment.status !== 1) {
      //   res.status(400).send({
      //     message: 'Order payment is not ready to be paid',
      //   });
      //   return;
      // }

      await orderPayment.update({
        status: 2,
        content,
      });

      await order.update({
        orderStatusId: 3,
      });

      await db.order_tracking.create({
        orderId: order.id,
        userId: 47, // TODO: DUMMY
        message: 'Order paid successfully',
      });

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
    console.error(err);
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
