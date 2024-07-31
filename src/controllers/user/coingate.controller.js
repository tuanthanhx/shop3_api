const db = require('../../models');
const logger = require('../../utils/logger');

require('dotenv').config();

exports.ipnCallback = async (req, res) => {
  try {
    const { body } = req;

    if (!body.status === 'paid') {
      res.status(400).send({
        message: 'Not paid.',
      });
      return;
    }

    const orderId = parseInt(body.order_id, 10);

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

    // const orderPayment = await order.getOrderPayment();

    // if (!orderPayment) {
    //   res.status(404).send({
    //     message: 'Order payment not found',
    //   });
    //   return;
    // }

    // await orderPayment.update({
    //   status: 2,
    //   paymentMethod: 'CoinGate',
    //   content: JSON.stringify(body),
    // });

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
