const { generateUniqueId } = require('../../utils/utils');
const logger = require('../../utils/logger');
const db = require('../../models');

exports.create = async (req, res) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    const { user } = req;
    const userId = user.id;

    const { cartIds } = req.body;

    const cartItemPromises = cartIds.map((cartId) => db.cart.findOne({
      where: {
        id: cartId,
        userId,
      },
      include: [
        {
          model: db.product_variant,
          as: 'productVariant',
          attributes: ['quantity', 'price'],
        },
      ],
    }));

    const cartItems = await Promise.all(cartItemPromises);

    const hasNotFound = cartItems.some((item) => item === null);
    if (hasNotFound) {
      res.status(400).json({
        error: 'Some cart items are not found',
      });
      return;
    }

    const shopOrdersMap = new Map();

    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];

      const {
        shopId,
        productId,
        productVariantId,
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

      const orderItem = {
        shopId,
        productId,
        productVariantId,
        quantity,
        price: productVariant ? productVariant.price : 0,
      };

      const order = shopOrdersMap.get(shopId);
      order.totalAmount += orderItem.price * orderItem.quantity;
      order.orderItems.push(orderItem);
    }

    // Process orders
    const orderCreationPromises = [];
    for (const orderData of shopOrdersMap.values()) {
      const { shopId, totalAmount, orderItems } = orderData;

      // eslint-disable-next-line no-await-in-loop
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

      const orderItemsWithOrderId = orderItems.map((item) => ({
        ...item,
        orderId: createdOrder.id,
      }));

      orderCreationPromises.push(
        db.order_item.bulkCreate(orderItemsWithOrderId, { transaction }),
      );
    }

    // Commit transaction
    await Promise.all([...orderCreationPromises]);
    await transaction.commit();

    res.json({
      data: {
        message: 'Orders created successfully',
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
