const { toHex, delay, scanHash } = require('../../utils/utils');
const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      page,
      limit,
    } = req.query;

    const condition = {
      userId,
    };

    const ordering = [['id', 'DESC']];

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.order_payment.findAndCountAll({
      where: condition,
      order: ordering,
      limit: limitPerPage,
      offset,
      distinct: true,
      attributes: ['id', 'paymentMethod', 'amount', 'status', 'content', 'createdAt'],
      include: [
        {
          model: db.order,
          attributes: ['id', 'uniqueId', 'totalAmount', 'shopId', 'orderStatusId', 'createdAt'],
        },
      ],
    });

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

    const formattedData = rows.map((row) => {
      const paymentObj = row.toJSON();
      return {
        ...paymentObj,
        code: toHex(`shop3_pid_${paymentObj.id}`),
      };
    });

    res.json({
      totalItems: count,
      totalPages,
      currentPage: pageNo,
      data: formattedData,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.show = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    const condition = {
      id,
      userId,
    };

    const payment = await db.order_payment.findOne({
      where: condition,
      attributes: ['id', 'paymentMethod', 'amount', 'status', 'content', 'createdAt'],
      include: [
        {
          model: db.order,
          attributes: ['id', 'uniqueId', 'totalAmount', 'shopId', 'orderStatusId', 'createdAt'],
        },
      ],
    });

    if (!payment) {
      res.status(404).send({
        message: 'Payment not found',
      });
      return;
    }

    const paymentObj = payment.toJSON();
    paymentObj.code = toHex(`shop3_pid_${paymentObj.id}`);

    res.json({
      data: paymentObj,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.payWithCrypto = async (req, res) => {
  try {
    const {
      hash,
      chainName,
      wait,
    } = req.body;

    // Wait for 10 seconds
    if (wait === undefined) {
      await delay(10000);
    } else {
      await delay(wait * 1000);
    }

    const transactionDetail = await scanHash(hash, chainName);

    const {
      status,
      customData,
    } = transactionDetail;

    if (!customData || !customData.startsWith('shop3_pid_')) {
      res.status(400).send({
        message: 'The transaction is not valid.',
      });
      return;
    }

    if (status !== 2) {
      res.status(400).send({
        message: 'The transaction in the network is not completed',
      });
      return;
    }

    const processErrors = [];
    const processPayment = async (transaction) => {
      const {
        to,
        amount,
        customData: customData2,
      } = transaction;

      const paymentId = parseInt(customData2?.replace('shop3_pid_', ''), 10);

      if (!paymentId) {
        processErrors.push('Cannot find payment ID from the transaction');
        return false;
      }

      const targetWallets = new Set([
        process.env.ETHSCAN_USDT_WALLET.toLowerCase(),
        process.env.BSCSCAN_USDT_WALLET.toLowerCase(),
        process.env.POLYGONSCAN_USDT_WALLET.toLowerCase(),
      ]);

      if (!targetWallets.has(to.toLowerCase())) {
        processErrors.push('This transaction was not sent to the correct address');
        return false;
      }

      const orderPayment = await db.order_payment.findOne({
        where: {
          id: paymentId,
        },
      });

      if (!orderPayment) {
        processErrors.push('Cannot find the payment data from the transaction');
        return false;
      }

      if (amount < orderPayment.amount) {
        processErrors.push('Actual payment amount is lower than requested amount');
        return false;
      }

      await orderPayment.update({
        status: 2,
        paymentMethod: 'Crypto Wallet',
        content: JSON.stringify(transaction),
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

      return true;
    };

    const paymentResult = await processPayment(transactionDetail);

    if (!paymentResult) {
      res.status(400).send({
        message: processErrors,
      });
      return;
    }

    res.json({
      data: {
        status,
        transactionDetail,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
