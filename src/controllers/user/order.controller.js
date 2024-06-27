const { generateUniqueId, tryParseJSON } = require('../../utils/utils');
const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    // const isAdministrator = user.userGroupId === 6;
    const isSeller = user.userGroupId === 2;
    const isUser = user.userGroupId === 1;

    const {
      status,
      page,
      limit,
    } = req.query;

    const condition = {};

    if (isSeller) {
      const shop = await db.shop.findOne({
        where: {
          userId,
        },
      });
      if (!shop) {
        res.status(404).send({
          message: 'Shop not found',
        });
        return;
      }
      condition.shopId = shop?.id;
    } else if (isUser) {
      condition.userId = userId;
    }

    switch (status) {
      case 'order_placed':
        // 1 - Order Placed
        // 2 - Payment Pending
        // 4 - Failed Payment
        // 23 - On Hold
        condition.orderStatusId = { [Op.in]: [1, 2, 4, 23] };
        break;
      case 'order_confirmed':
        // 3 - Payment Confirmed
        // 5 - Order Processing
        // 6 - Awaiting Stock
        // 7 - Order Packed
        // 8 - Ready for Shipment
        condition.orderStatusId = { [Op.in]: [3, 5, 6, 7, 8] };
        break;
      case 'shipping':
        // 9 - Shipped
        // 10 - In Transit
        // 11 - Out for Delivery
        // 12 - Attempted Delivery
        // 13 - Delivered
        // 24 - Partially Shipped
        // 25 - Partially Delivered
        condition.orderStatusId = { [Op.in]: [9, 10, 11, 12, 13, 24, 25] };
        break;
      case 'completed':
        // 14 - Completed
        condition.orderStatusId = { [Op.in]: [14] };
        break;
      case 'cancelled':
        // 15 - Cancelled
        condition.orderStatusId = { [Op.in]: [15] };
        break;
      case 'refund':
        // 16 - Return Requested
        // 17 - Return Approved
        // 18 - Return In Transit
        // 19 - Return Received
        // 20 - Refund Initiated
        // 21 - Refund Processed
        // 22 - Returned to Sender
        condition.orderStatusId = { [Op.in]: [16, 17, 18, 19, 20, 21, 22] };
        break;
      default:
        break;
    }

    const ordering = [['id', 'DESC']];

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.order.findAndCountAll({
      where: condition,
      order: ordering,
      distinct: true,
      limit: limitPerPage,
      offset,
      attributes: ['id', 'uniqueId', 'totalAmount', 'createdAt', 'updatedAt'],
      include: [
        {
          model: db.shop,
          attributes: ['id', 'shopName'],
          as: 'shop',
        },
        {
          model: db.user,
          attributes: ['id', 'uuid', 'name', 'avatar'],
          as: 'user',
        },
        {
          model: db.order_status,
          attributes: ['name'],
          as: 'orderStatus',
        },
        {
          model: db.order_payment,
          attributes: ['id', 'paymentMethod', 'amount', 'status', 'content'],
          as: 'orderPayment',
        },
        {
          model: db.order_shipping,
          attributes: ['id', 'firstName', 'lastName', 'phone', 'countryCode', 'address', 'logisticsServiceName', 'logisticsProviderName', 'logisticsTrackingCode', 'fee', 'status'],
          as: 'orderShipping',
        },
        {
          model: db.review,
          attributes: ['id'],
        },
        {
          model: db.order_item,
          attributes: ['id', 'quantity', 'price', 'productVariant'],
          as: 'orderItems',
          include: [
            {
              model: db.product,
              as: 'product',
              attributes: ['id', 'name'],
              include: [
                {
                  model: db.product_image,
                  as: 'productImages',
                  attributes: ['id', 'file'],
                  limit: 1,
                },
              ],
            },
          ],
        },
      ],
    });

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

    const formattedData = rows.map((row) => {
      const order = row.toJSON();
      const formattedItems = order.orderItems.map((orderItem) => ({
        ...orderItem,
        productVariant: tryParseJSON(orderItem.productVariant),
      }));
      const isReviewed = !!order.reviews?.length;
      const orderPaymentContent = tryParseJSON(order.orderPayment?.content);
      delete order.orderItems;
      delete order.reviews;
      return {
        ...order,
        isReviewed,
        orderPayment: {
          ...order.orderPayment,
          content: orderPaymentContent,
        },
        orderItems: formattedItems,
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

exports.getStatistics = async (req, res) => {
  try {
    const { user } = req;
    const isUser = user.userGroupId === 1;
    const isSeller = user.userGroupId === 2;
    // const isAdministrator = user.userGroupId === 6;

    const condition = {};

    if (isSeller) {
      const shop = await db.shop.findOne({ where: { userId: user.id } });
      if (!shop) {
        res.status(404).send({
          message: 'Shop not found',
        });
        return;
      }
      condition.shopId = shop.id;
    } else if (isUser) {
      condition.userId = user.id;
    }

    const statusCounts = await db.order.findAll({
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'all'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN orderStatusId IN (1, 2, 4, 23) THEN 1 ELSE 0 END')), 'orderPlaced'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN orderStatusId IN (3, 5, 6, 7, 8) THEN 1 ELSE 0 END')), 'orderConfirmed'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN orderStatusId IN (9, 10, 11, 12, 13, 24, 25) THEN 1 ELSE 0 END')), 'shipping'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN orderStatusId = 14 THEN 1 ELSE 0 END')), 'completed'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN orderStatusId = 15 THEN 1 ELSE 0 END')), 'cancelled'],
        [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN orderStatusId IN (16, 17, 18, 19, 20, 21, 22) THEN 1 ELSE 0 END')), 'refund'],
      ],
      where: condition,
      raw: true,
    });

    const response = {
      all: statusCounts[0].all || 0,
      orderPlaced: statusCounts[0].orderPlaced || 0,
      orderConfirmed: statusCounts[0].orderConfirmed || 0,
      shipping: statusCounts[0].shipping || 0,
      completed: statusCounts[0].completed || 0,
      cancelled: statusCounts[0].cancelled || 0,
      refund: statusCounts[0].refund || 0,
    };

    res.json(response);
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

    // const isAdministrator = user.userGroupId === 6;
    const isSeller = user.userGroupId === 2;
    const isUser = user.userGroupId === 1;

    const { id } = req.params;

    const condition = {
      id,
      // userId,
    };

    if (isSeller) {
      const shop = await db.shop.findOne({
        where: {
          userId,
        },
      });
      if (!shop) {
        res.status(404).send({
          message: 'Shop not found',
        });
        return;
      }
      condition.shopId = shop?.id;
    } else if (isUser) {
      condition.userId = userId;
    }

    const order = await db.order.findOne({
      where: condition,
      attributes: ['id', 'uniqueId', 'totalAmount'],
      include: [
        {
          model: db.shop,
          attributes: ['id', 'shopName'],
          as: 'shop',
        },
        {
          model: db.order_status,
          attributes: ['name'],
          as: 'orderStatus',
        },
        {
          model: db.order_payment,
          attributes: ['id', 'paymentMethod', 'amount', 'status', 'content'],
          as: 'orderPayment',
        },
        {
          model: db.order_shipping,
          attributes: ['id', 'firstName', 'lastName', 'phone', 'countryCode', 'address', 'logisticsServiceName', 'logisticsProviderName', 'logisticsTrackingCode', 'fee', 'status'],
          as: 'orderShipping',
        },
        {
          model: db.order_item,
          attributes: ['id', 'quantity', 'price', 'productVariant'],
          as: 'orderItems',
          include: [
            {
              model: db.product,
              as: 'product',
              attributes: ['id', 'name'],
              include: [
                {
                  model: db.product_image,
                  as: 'productImages',
                  attributes: ['id', 'file'],
                  limit: 1,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    const orderObj = order.toJSON();

    const formattedOrderItems = orderObj.orderItems.map((orderItem) => ({
      ...orderItem,
      productVariant: tryParseJSON(orderItem.productVariant),
    }));

    delete orderObj.orderItems;

    res.json({
      data: {
        ...orderObj,
        orderItems: formattedOrderItems,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.create = async (req, res) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    const { user } = req;
    const userId = user.id;

    const {
      cartIds,
      paymentMethodId,
      logisticsProviderOptionId,
      userAddressId,
    } = req.body;

    const cartItemPromises = cartIds.map((cartId) => db.cart.findOne({
      where: {
        id: cartId,
        userId,
      },
      include: [
        {
          model: db.product_variant,
          as: 'productVariant',
          attributes: ['id', 'quantity', 'price'],
          include: [
            {
              model: db.option,
              include: {
                model: db.variant,
              },
            },
          ],
        },
      ],
    }));

    const cartItems = await Promise.all(cartItemPromises);

    const hasNotFound = cartItems.some((item) => item === null);
    if (hasNotFound) {
      res.status(404).json({
        error: 'Some cart items are not found',
      });
      return;
    }

    let paymentMethod;

    if (paymentMethodId > 0) {
      paymentMethod = await db.payment_method.findOne({
        where: {
          userId,
          id: paymentMethodId,
        },
        include: [
          {
            model: db.payment_method_type,
            attributes: ['name'],
          },
        ],
      });

      if (!paymentMethod) {
        res.status(404).json({
          error: 'Payment method not found',
        });
        return;
      }
    } else if (paymentMethodId === 0) {
      paymentMethod = {
        payment_method_type: {
          name: 'COD',
        },
      };
    } else if (paymentMethodId === -1) {
      paymentMethod = {
        payment_method_type: {
          name: 'NOWPayments',
        },
      };
    }

    const logisticsProviderOption = await db.logistics_provider_option.findOne({
      where: {
        id: logisticsProviderOptionId,
      },
      include: [
        {
          model: db.logistics_service,
          as: 'logisticsService',
          attributes: ['name'],
        },
        {
          model: db.logistics_provider,
          as: 'logisticsProvider',
          attributes: ['name'],
        },
      ],
    });

    if (!logisticsProviderOption) {
      res.status(404).json({
        error: 'Logistics provider not found 2',
      });
      return;
    }

    const userAddress = await db.user_address.findOne({
      where: {
        userId,
        id: userAddressId,
      },
      attributes: ['firstName', 'lastName', 'phone', 'countryCode', 'address'],
    });

    if (!userAddress) {
      res.status(404).json({
        error: 'User address not found',
      });
      return;
    }

    const shopOrdersMap = new Map();

    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];

      const {
        shopId,
        productId,
        productVariant,
        quantity,
      } = cartItem;

      if (!shopOrdersMap.has(shopId)) {
        shopOrdersMap.set(shopId, {
          shopId,
          userId,
          totalAmount: 0,
          orderItems: [],
        });
      }

      const productVariantObj = productVariant?.toJSON();

      const orderItem = {
        shopId,
        productId,
        quantity,
        price: productVariant ? productVariant.price : 0,
        productVariant: {
          refId: productVariantObj.id,
          price: productVariantObj.price,
          images: productVariantObj.options?.map((option) => option.image).filter((image) => image !== null),
          variants: productVariantObj.options?.map((option) => ({
            name: option.variant.name,
            value: option.name,
          })),
        },
      };

      const order = shopOrdersMap.get(shopId);
      order.totalAmount += orderItem.price * orderItem.quantity;
      order.orderItems.push(orderItem);
    }

    const orderCreationPromises = [];
    const orderIds = [];
    for (const orderData of shopOrdersMap.values()) {
      const { shopId, totalAmount, orderItems } = orderData;

      const createdOrder = await db.order.create({
        uniqueId: generateUniqueId(),
        userId,
        shopId,
        totalAmount,
        orderStatusId: 1,
      }, { transaction });

      if (!createdOrder) {
        res.status(400).json({
          error: 'Cannot create a new order',
        });
        return;
      }

      orderIds.push(createdOrder.id);

      const orderItemsWithOrderId = orderItems.map((item) => ({
        ...item,
        orderId: createdOrder.id,
      }));

      await db.order_payment.create({
        userId,
        shopId,
        orderId: createdOrder.id,
        amount: totalAmount,
        paymentMethod: paymentMethod?.payment_method_type?.name,
        status: 1,
        content: '',
      }, { transaction });

      await db.order_shipping.create({
        userId,
        shopId,
        orderId: createdOrder.id,
        logisticsServiceName: logisticsProviderOption.logisticsService?.name,
        logisticsProviderName: logisticsProviderOption.logisticsProvider?.name,
        fee: 0, // TODO: Dummy
        status: 1,
        firstName: userAddress.firstName,
        lastName: userAddress.lastName,
        phone: userAddress.phone,
        countryCode: userAddress.countryCode,
        address: userAddress.address,
      }, { transaction });

      await db.order_tracking.create({
        orderId: createdOrder.id,
        userId,
        message: 'Order has been created',
      }, { transaction });

      orderCreationPromises.push(
        db.order_item.bulkCreate(orderItemsWithOrderId, { transaction }),
      );
    }

    await Promise.all([...orderCreationPromises]);
    await db.cart.destroy({
      where: {
        id: cartIds,
        userId,
      },
      transaction,
    });
    await transaction.commit();
    res.json({
      data: {
        message: 'Orders created successfully',
        orderIds,
      },
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.pay = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    const {
      content,
    } = req.body;

    const order = await db.order.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    if (![1, 2, 4].includes(order.orderStatusId)) {
      res.status(400).send({
        message: 'Order is not ready to be paid',
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

    if (orderPayment.status !== 1) {
      res.status(400).send({
        message: 'Order payment is not ready to be paid',
      });
      return;
    }

    await orderPayment.update({
      status: 2,
      content,
    });

    await order.update({
      orderStatusId: 3,
    });

    await db.order_tracking.create({
      orderId: order.id,
      userId,
      message: 'Order paid successfully',
    });

    res.json({
      data: {
        message: 'Order paid successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    const order = await db.order.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    if (![1, 2, 4].includes(order.orderStatusId)) {
      res.status(400).send({
        message: 'Cannot cancel order after it has been confirmed',
      });
      return;
    }

    await order.update({
      orderStatusId: 15,
    });

    await db.order_tracking.create({
      orderId: order.id,
      userId,
      message: 'Order has been cancelled',
    });

    res.json({
      data: {
        message: 'Order cancelled successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.complete = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    const order = await db.order.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    if (![9, 10, 11, 12, 13, 24, 25].includes(order.orderStatusId)) {
      res.status(400).send({
        message: 'Cannot mark order as completed while it is not delivered',
      });
      return;
    }

    await order.update({
      orderStatusId: 14,
    });

    await db.order_tracking.create({
      orderId: order.id,
      userId,
      message: 'Order has been completed',
    });

    res.json({
      data: {
        message: 'Order marked as completed successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    // const isAdministrator = user.userGroupId === 6;
    const isSeller = user.userGroupId === 2;
    // const isUser = user.userGroupId === 1;

    const { id } = req.params;

    const {
      statusId,
    } = req.body;

    condition = {
      id,
    };

    if (isSeller) {
      const shop = await db.shop.findOne({
        where: {
          userId,
        },
      });
      if (!shop) {
        res.status(404).send({
          message: 'Shop not found',
        });
        return;
      }
      condition.shopId = shop?.id;
    }

    const order = await db.order.findOne({
      where: condition,
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    const orderStatus = await db.order_status.findOne({
      where: {
        id: statusId,
      },
    });

    if (!orderStatus) {
      res.status(404).send({
        message: 'Order Status not found',
      });
      return;
    }

    await order.update({
      orderStatusId: statusId,
    });

    await db.order_tracking.create({
      orderId: order.id,
      userId,
      message: `The status of the order has been changed to ${orderStatus?.name}`,
    });

    res.json({
      data: {
        message: 'Update status successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    condition = {
      id,
      userId,
    };

    const order = await db.order.findOne({
      where: condition,
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    const orderId = order?.id;

    const data = await db.review.findAll({
      where: {
        orderId,
      },
      attributes: ['id', 'orderItemId', 'rate', 'message', 'images', 'videos'],
    });

    res.json({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    const {
      reviews,
    } = req.body;

    condition = {
      id,
      userId,
    };

    const order = await db.order.findOne({
      where: condition,
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    if (![13, 14].includes(order.orderStatusId)) {
      res.status(400).send({
        message: 'Cannot review product while it is not completed',
      });
      return;
    }

    const orderId = order?.id;
    const shopId = order?.shopId;

    const orderItems = await db.order_item.findAll({ where: { orderId } });

    for (let i = 0; i < reviews.length; i++) {
      const {
        orderItemId,
        rate,
        message,
        images,
        videos,
      } = reviews[i];

      if (orderItems.some((item) => item.id === orderItemId)) {
        const [review, createdReview] = await db.review.findOrCreate({
          where: {
            orderId,
            shopId,
            userId,
            orderItemId,
          },
          defaults: {
            rate,
            message,
            images: images || [],
            videos: videos || [],
          },
        });

        if (!createdReview) {
          await review.update({
            rate,
            message,
            images: images || [],
            videos: videos || [],
          });
        }
      }
    }

    res.json({
      data: {
        message: 'Reviewed order successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getTracking = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db.order.findOne({
      where: {
        id,
      },
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    const orderId = order?.id;

    const data = await db.order_tracking.findAll({
      where: {
        orderId,
      },
      order: [['id', 'DESC']],
      attributes: ['id', 'message', 'createdAt'],
    });

    res.json({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createTracking = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const isSeller = user.userGroupId === 2;

    const { id } = req.params;

    const {
      message,
    } = req.body;

    if (!isSeller) {
      res.status(403).send({
        message: 'You do not have perrmision to create tracking',
      });
      return;
    }

    const shop = await db.shop.findOne({
      where: {
        userId,
      },
    });
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const shopId = shop?.id;

    const condition = {
      id,
      shopId,
    };

    const order = await db.order.findOne({
      where: condition,
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    const orderId = order?.id;

    await db.order_tracking.create({
      orderId,
      userId,
      message,
    });

    res.json({
      data: {
        message: 'Created tracking successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
