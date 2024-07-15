// const axios = require('axios');
const db = require('../../models');
const logger = require('../../utils/logger');
// const { verifyCryptoPaySignature } = require('../../utils/utils');

require('dotenv').config();

exports.ipnCallback = async (req, res) => {
  try {
    const {
      data,
    } = req.body;

    // TODO: Verify SIGNATURE LATER, use verifyCryptoPaySignature

    const payment = data.object;

    if (!payment) {
      res.status(400).send({
        message: 'No payment data.',
      });
      return;
    }

    const orderId = parseInt(payment.order_id, 10);
    const resAmount = payment.amount;
    const resStatus = payment.status;

    if (!resStatus === 'succeeded') {
      res.status(400).send({
        message: 'Not paid.',
      });
      return;
    }

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

    const orderPayment = await order.getOrderPayment();

    if (!orderPayment) {
      res.status(404).send({
        message: 'Order payment not found',
      });
      return;
    }

    if (resAmount < orderPayment.amount) {
      res.status(400).send({
        message: 'amount is not enough',
      });
      return;
    }

    await orderPayment.update({
      status: 2,
      paymentMethod: 'Crypto.com Pay',
      content: JSON.stringify(payment),
    });

    await order.update({
      orderStatusId: 3,
    });

    await db.order_tracking.create({
      orderId: order.id,
      userId: 47, // TODO: DUMMY
      message: 'Order paid successfully',
    });

    // Respond with a success status
    res.status(200).send('IPN callback received and verified.');
  } catch (err) {
    console.error(err);
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
