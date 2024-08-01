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

    if (!receivedSignature) {
      res.status(400).send({
        message: 'Cannot find x-nowpayments-sig',
      });
      return;
    }

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

      const paymentId = parseInt(sortedParams.order_id?.replace('PID-', ''), 10);

      if (!paymentId) {
        res.status(404).send({
          message: 'paymentId not found',
        });
        return;
      }

      const orderPayment = await db.order_payment.findOne({
        where: {
          id: paymentId,
        },
      });

      if (!orderPayment) {
        res.status(404).send({
          message: 'Payment not found',
        });
        return;
      }

      // if (orderPayment.status !== 1) {
      //   res.status(400).send({
      //     message: 'Order payment is not ready to be paid',
      //   });
      //   return;
      // }

      // TODO: Later need to check if price_amount is ok or should use another field, I am still worried that user might be able to pay lower amount than that field
      if (sortedParams.price_amount < orderPayment.amount) {
        res.status(400).send({
          message: 'Actual payment amount is lower than requested amount',
        });
        return;
      }

      await orderPayment.update({
        status: 2,
        paymentMethod: 'NOWPayments',
        content: JSON.stringify(sortedParams),
      });

      const orders = await orderPayment.getOrders();

      if (orders?.length) {
        const updateOrderPromises = orders.map(async (order) => {
          await order.update({
            orderStatusId: 3,
          });
          await db.order_tracking.create({
            orderId: order.id,
            userId: 47, // TODO: DUMMY
            message: 'Order paid successfully',
          });
        });
        await Promise.all(updateOrderPromises);
      }

      // Respond with a success status
      res.json({
        data: {
          message: 'IPN callback received and verified.',
        },
      });
    } else {
      // Respond with an error status
      res.status(400).send({
        message: 'IPN callback signature mismatch.',
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
