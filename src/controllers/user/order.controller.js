const { generateUniqueId } = require('../../utils/utils');
const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      status,
      page,
      limit,
    } = req.query;

    const condition = {
      userId,
    };

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
      limit: limitPerPage,
      offset,
      attributes: ['id', 'uniqueId', 'totalAmount', 'createdAt', 'updatedAt'],
      include: [
        {
          model: db.shop,
          attributes: ['shopName'],
          as: 'shop',
        },
        {
          model: db.order_status,
          attributes: ['name'],
          as: 'orderStatus',
        },
        {
          model: db.order_item,
          attributes: ['id', 'quantity', 'price'],
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
            {
              model: db.product_variant,
              as: 'productVariant',
              attributes: ['id', 'sku', 'quantity', 'price'],
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
        },
      ],
    });

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

    const formattedData = rows.map((order) => {
      const formattedItems = order.orderItems.map((refItem) => {
        const orderItem = refItem.toJSON();
        const newOptions = orderItem.productVariant.options.map((option) => ({
          variantId: option.variantId,
          variantName: option.variant.name,
          optionId: option.id,
          optionName: option.name,
          optionImage: option.image,
        }));

        const updatedProduct = { ...orderItem.product };

        orderItem.productVariant.options.forEach((option) => {
          if (option.image) {
            updatedProduct.variantImage = option.image;
          }
        });

        return {
          ...orderItem,
          product: updatedProduct,
          productVariant: {
            ...orderItem.productVariant,
            options: newOptions,
          },
        };
      });

      delete order.orderItems;

      return {
        ...order.toJSON(),
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

exports.show = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    const order = await db.order.findOne({
      where: {
        id,
        userId,
      },
      attributes: ['id', 'uniqueId', 'totalAmount'],
      include: [
        {
          model: db.shop,
          attributes: ['shopName'],
          as: 'shop',
        },
        {
          model: db.order_status,
          attributes: ['name'],
          as: 'orderStatus',
        },
        {
          model: db.order_item,
          attributes: ['id', 'quantity', 'price'],
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
            {
              model: db.product_variant,
              as: 'productVariant',
              attributes: ['id', 'sku', 'quantity', 'price'],
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
        },
      ],
    });

    if (!order) {
      res.status(404).send({
        message: 'Order not found',
      });
      return;
    }

    const orderObject = order.toJSON();

    const formatedData = orderObject.orderItems.map((orderItem) => {
      const newOptions = orderItem.productVariant.options.map((option) => ({
        variantId: option.variantId,
        variantName: option.variant.name,
        optionId: option.id,
        optionName: option.name,
        optionImage: option.image,
      }));

      const updatedProduct = { ...orderItem.product };

      orderItem.productVariant.options.forEach((option) => {
        if (option.image) {
          updatedProduct.variantImage = option.image;
        }
      });
      return {
        ...orderItem,
        product: updatedProduct,
        productVariant: {
          ...orderItem.productVariant,
          options: newOptions,
        },
      };
    });

    delete orderObject.orderItems;

    res.json({
      data: {
        ...orderObject,
        orderItems: formatedData,
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

    const orderCreationPromises = [];
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

      const orderItemsWithOrderId = orderItems.map((item) => ({
        ...item,
        orderId: createdOrder.id,
      }));

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
