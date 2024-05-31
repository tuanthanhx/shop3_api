const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;
    const data = await db.cart.findAll({
      where: {
        userId,
      },
      attributes: ['id', 'quantity'],
      include: [
        {
          model: db.shop,
          as: 'shop',
          attributes: ['id', 'shopName'],
        },
        {
          model: db.product,
          as: 'product',
          attributes: ['id', 'name'],
        },
        {
          model: db.product_variant,
          as: 'productVariant',
          attributes: ['id', 'sku', 'quantity', 'price'],
        },
      ],
    });

    const groupedData = data.reduce((acc, cartItem) => {
      const shopId = cartItem.shop.id;
      if (!acc[shopId]) {
        acc[shopId] = {
          shop: cartItem.shop,
          items: [],
        };
      }
      acc[shopId].items.push({
        id: cartItem.id,
        quantity: cartItem.quantity,
        product: cartItem.product,
        productVariant: cartItem.productVariant,
      });
      return acc;
    }, {});

    res.json({
      data: Object.values(groupedData),
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      productId,
      productVariantId,
      quantity,
    } = req.body;

    const object = {
      userId,
      productId,
      productVariantId,
      quantity,
    };

    const product = await db.product.findByPk(productId, {
      where: {
        productStatusId: 1,
      },
      include: [
        {
          model: db.product_variant,
          as: 'productVariants',
          where: {
            id: productVariantId,
          },
        },
      ],
    });

    if (!product) {
      res.status(404).json({
        error: 'Product or variant not found',
      });
      return;
    }

    const cartItem = await db.cart.findOne({
      where: {
        userId,
        productId,
        productVariantId,
      },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.productVariants[0].dataValues.quantity) {
        res.status(400).json({
          error: 'Requested quantity exceeds available stock',
        });
        return;
      }

      await cartItem.update({
        quantity: newQuantity,
      });
      res.status(200).json({
        data: {
          message: 'Cart item updated successfully',
        },
        product,
      });
    } else {
      if (object.quantity > product.productVariants[0].dataValues.quantity) {
        res.status(400).json({
          error: 'Requested quantity exceeds available stock',
        });
        return;
      }
      object.shopId = product.shopId;
      await db.cart.create(object);
      res.status(200).json({
        data: {
          message: 'Cart item created successfully',
        },
        product,
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
