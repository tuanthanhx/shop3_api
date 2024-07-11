const axios = require('axios');
const db = require('../../models');
const logger = require('../../utils/logger');

require('dotenv').config();

exports.ipnCallback = async (req, res) => {
  try {
    const {
      status,
      order_id: cbOrderId,
    } = req.query;

    if (!parseInt(status, 10) === 2) {
      res.status(400).send({
        message: 'Not paid.',
      });
      return;
    }

    const response = await axios.get(`${process.env.BLOCKONOMICS_API_URL}/merchant_order/${cbOrderId}`, {
      headers: {
        Authorization: `Bearer ${process.env.BLOCKONOMICS_API_KEY}`,
      },
    });

    const extraData = response.data?.data?.extradata;
    const resAmount = response.data?.value;
    const resStatus = response.data?.status;

    if (!resStatus === 2) {
      res.status(400).send({
        message: 'Not paid.',
      });
      return;
    }

    if (!extraData) {
      res.status(400).send({
        message: 'extraData not found',
      });
      return;
    }

    const orderId = parseInt(extraData.replace('order_id-', ''), 10);

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
      paymentMethod: 'Blockonomics',
      content: JSON.stringify(response.data),
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
