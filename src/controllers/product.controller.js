/* eslint-disable */
const { generateProductId } = require('../utils/utils');
const gcs = require('../utils/gcs');
const db = require('../models');

const Products = db.product;
const ProductImages = db.product_image;
const ProductVideos = db.product_video;
const ProductVariants = db.product_variant;
const Variants = db.variant;
const VariantOptions = db.variant_option;
const Shops = db.shop;
const { Op } = db.Sequelize;

exports.findAll = async (req, res) => {
  try {
    const { user } = req;
    const isAdministrator = user.userGroupId === 6;

    const {
      name,
      statusId,
      page,
      limit,
    } = req.query;

    const condition = {};
    if (!isAdministrator) {
      const foundShop = await Shops.findOne({ where: { userId: user.id } });
      if (!foundShop) {
        res.status(404).send({
          message: 'Shop not found',
        });
        return;
      }
      const shopId = foundShop.id;
      condition.shopId = shopId;
    }

    if (name) {
      condition.name = { [Op.like]: `%${name}%` };
    }
    if (statusId) {
      condition.productStatusId = statusId;
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await Products.findAndCountAll({
      where: condition,
      limit: limitPerPage,
      offset,
      distinct: true,
      include: [
        {
          model: db.product_image,
          as: 'productImages',
          attributes: ['id', 'file'],
        },
        {
          model: db.product_video,
          as: 'productVideos',
          attributes: ['id', 'file'],
        },
      ],
    });

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

    res.json({
      totalItems: count,
      totalPages,
      currentPage: pageNo,
      data: rows,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { user } = req;

    const foundShop = await Shops.findOne({ where: { userId: user.id } });
    if (!foundShop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }
    const shopId = foundShop.id;

    const {
      name,
      categoryId,
      description,
      price,
      productStatusId,
      variants,
      variantsData,
    } = req.body;

    const object = {
      name,
      uniqueId: generateProductId(),
      categoryId,
      description,
      price,
      productStatusId: productStatusId || 5,
      shopId,
    };

    const createdProduct = await Products.create(object);

    // Create variants and associate with the product
    const parsedVariants = JSON.parse(variants);
    for (const variantData of parsedVariants) {
      const { name: variantName } = variantData;
      const variant = await db.variant.create({ name: variantName, productId: createdProduct.id });

      for (const optionName of variantData.options) {
        await db.option.create({ name: optionName, variantId: variant.id, productId: createdProduct.id });
      }

      await createdProduct.addVariant(variant);
    }

    // Create variant data
    const parsedVariantsData = JSON.parse(variantsData);
    for (const variantData of parsedVariantsData) {
      const variantOptions = [];

      // Find options for each variant
      for (const optionData of variantData.options) {
        const variant = await db.variant.findOne({ where: { name: optionData.name, productId: createdProduct.id } });
        const option = await db.option.findOne({ where: { name: optionData.value, variantId: variant.id } });
        variantOptions.push(option);
      }

      const productVariant = await db.product_variant.create({
        price: variantData.price,
        sku: variantData.SKU,
        quantity: variantData.quantity,
        productId: createdProduct.id,
      });

      await productVariant.setOptions(variantOptions);
    }

    const foundProduct = await Products.findByPk(createdProduct.id, {
      include: {
        model: db.variant,
        include: {
          model: db.option,
          include: {
            model: db.product_variant,
          },
        },
      }
    });
    res.status(201).json({
      data: foundProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.update = async (req, res) => {
  try {

    const { user } = req;

    const foundShop = await Shops.findOne({ where: { userId: user.id } });
    if (!foundShop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }
    const shopId = foundShop.id;

    const productId = req.params.id;

    const {
      name,
      categoryId,
      description,
      price,
      productStatusId,
      variants,
      variantsData,
    } = req.body;

    const object = {
      name,
      categoryId,
      description,
      productStatusId: productStatusId || 5,
    };

    const product = await db.product.findOne({
      where: {
        id: productId,
        shopId
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product details
    await product.update(object);

    if (variants && variantsData) {
      await db.variant.destroy({ where: { productId: product.id } });
      await db.option.destroy({ where: { productId: product.id } });
      await db.product_variant.destroy({ where: { productId: product.id } });

      // Create variants and associate with the product
      const parsedVariants = JSON.parse(variants);
      for (const variantData of parsedVariants) {
        const { name: variantName } = variantData;
        const variant = await db.variant.create({ name: variantName, productId: product.id });

        for (const optionName of variantData.options) {
          await db.option.create({ name: optionName, variantId: variant.id, productId: product.id });
        }

        await product.addVariant(variant);
      }

      // Create variant data
      const parsedVariantsData = JSON.parse(variantsData);
      for (const variantData of parsedVariantsData) {
        const variantOptions = [];

        // Find options for each variant
        for (const optionData of variantData.options) {
          const variant = await db.variant.findOne({ where: { name: optionData.name, productId: product.id } });
          const option = await db.option.findOne({ where: { name: optionData.value, variantId: variant.id } });
          variantOptions.push(option);
        }

        const productVariant = await db.product_variant.create({
          price: variantData.price,
          sku: variantData.SKU,
          quantity: variantData.quantity,
          productId: product.id,
        });

        await productVariant.setOptions(variantOptions);
      }

    }

    const foundProduct = await Products.findByPk(product.id, {
      include: {
        model: db.variant,
        include: {
          model: db.option,
          include: {
            model: db.product_variant,
          },
        },
      }
    });

    res.status(200).json({
      data: foundProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const product = await Products.findByPk(id);
    if (!product) {
      res.status(404).send({
        message: 'Product not found',
      });
      return;
    }

    const isAdministrator = user.userGroupId === 6;
    if (!isAdministrator) {
      const foundShop = await Shops.findOne({ where: { userId: user.id } });
      if (!foundShop) {
        res.status(404).send({
          message: 'Shop not found',
        });
        return;
      }

      const shopId = foundShop.id;
      if (product.shopId !== shopId) {
        res.status(403).send({
          message: 'You do not have permission to delete it',
        });
        return;
      }
    }

    await product.destroy();

    await db.variant.destroy({ where: { productId: id } });
    await db.option.destroy({ where: { productId: id } });
    await db.product_variant.destroy({ where: { productId: id } });

    res.status(204).end();
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
