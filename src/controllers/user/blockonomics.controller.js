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

    if (!status || !cbOrderId) {
      res.status(201).send({
        message: 'Your payment has been processed. Now you can close this tab.',
      });
      return;
    }

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

    const paymentId = parseInt(extraData.replace('payment_id-', ''), 10);

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

    // TODO: Later need to check if data.value is ok or should use another field, I am still worried that user might be able to pay lower amount than that field
    if (resAmount < orderPayment.amount) {
      res.status(400).send({
        message: 'Actual payment amount is lower than requested amount',
      });
      return;
    }

    await orderPayment.update({
      status: 2,
      paymentMethod: 'Blockonomics',
      content: JSON.stringify(response.data),
    });

    const orders = await orderPayment.getOrders();

    if (orders?.length) {
      const updateOrderPromises = orders.map(async (order) => {
        if (order.orderStatusId === 1 || order.orderStatusId === 2 || order.orderStatusId === 4) {
          await order.update({
            orderStatusId: 3,
          });
          await db.order_tracking.create({
            orderId: order.id,
            userId: 47, // TODO: DUMMY
            message: 'Order paid successfully',
          });
        }
      });
      await Promise.all(updateOrderPromises);
    }

    // Respond with a success status
    res.json({
      data: {
        message: 'IPN callback received and verified.',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
