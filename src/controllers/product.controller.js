const { generateUniqueId, isOnlyUpdateProductVariants } = require('../utils/utils');
const logger = require('../utils/logger');
const db = require('../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const { user } = req;

    const {
      keyword,
      minPrice,
      maxPrice,
      categoryId,
      // commissionPlanStatus,
      codStatus,
      // affiliateOpportunityFilter,
      // hasPriceDiagnosticResult,
      statusId,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {};

    const foundShop = await db.shop.findOne({ where: { userId: user.id } });
    if (!foundShop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }
    const shopId = foundShop.id;

    condition.shopId = shopId;

    if (keyword) {
      condition[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { uniqueId: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        db.sequelize.literal(`EXISTS (SELECT 1 FROM product_variants AS pv WHERE pv.productId = product.id AND pv.sku LIKE '%${keyword}%')`),
      ];
    }

    const variantConditions = [];

    if (minPrice) {
      variantConditions.push(`pv.price >= ${minPrice}`);
    }

    if (maxPrice) {
      variantConditions.push(`pv.price <= ${maxPrice}`);
    }

    if (variantConditions.length > 0) {
      condition[Op.and] = db.sequelize.literal(`EXISTS (SELECT 1 FROM product_variants AS pv WHERE pv.productId = product.id AND ${variantConditions.join(' AND ')})`);
    }

    if (categoryId) {
      const categoryArray = categoryId.split(',').map((id) => parseInt(id.trim(), 10));
      condition.categoryId = { [Op.in]: categoryArray };
    }

    if (codStatus !== undefined) {
      condition.cod = codStatus;
    }

    if (statusId) {
      condition.productStatusId = statusId;
    }

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['name', 'uniqueId', 'createdAt', 'updatedAt', 'price'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        if (sortField === 'price') {
          ordering = [[{ model: db.product_variant, as: 'productVariants' }, sortField, sortOrder.toUpperCase()]];
        } else {
          ordering = [[sortField, sortOrder.toUpperCase()]];
        }
      }
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.product.findAndCountAll({
      where: condition,
      order: ordering,
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
        {
          model: db.logistics_service,
          as: 'logisticsServices',
          attributes: ['id', 'uniqueId', 'name'],
          through: {
            attributes: [],
          },
        },
        {
          model: db.product_attribute,
          as: 'productAttributes',
          attributes: ['name', 'value'],
        },
        {
          model: db.variant,
          include: {
            model: db.option,
          },
        },
        {
          model: db.product_variant,
          as: 'productVariants',
          required: sortField === 'price',
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
    });

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

    const formattedRows = rows.map((row) => {
      const rowData = row.toJSON();

      const variants = rowData.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        options: variant.options.map((option) => ({
          id: option.id,
          name: option.name,
          image: option.image,
        })),
      }));

      const productVariants = rowData.productVariants.map((pv) => {
        const options = pv.options.map((option) => ({
          variantId: option.variantId,
          name: option.variant.name,
          optionId: option.id,
          value: option.name,
        }));

        return {
          options,
          id: pv.id,
          price: pv.price,
          sku: pv.sku,
          quantity: pv.quantity,
        };
      });

      delete rowData.variants;
      delete rowData.productVariants;

      return {
        ...rowData,
        variants,
        productVariants,
      };
    });

    res.json({
      totalItems: count,
      totalPages,
      currentPage: pageNo,
      data: formattedRows,
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
    const { id } = req.params;
    const { user } = req;

    const product = await db.product.findByPk(id, {
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
        {
          model: db.logistics_service,
          as: 'logisticsServices',
          attributes: ['id', 'uniqueId', 'name'],
          through: {
            attributes: [],
          },
        },
        {
          model: db.product_attribute,
          as: 'productAttributes',
          attributes: ['name', 'value'],
        },
        {
          model: db.variant,
          include: {
            model: db.option,
          },
        },
        {
          model: db.product_variant,
          as: 'productVariants',
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
    });

    if (!product) {
      res.status(404).send({
        message: 'Product not found',
      });
      return;
    }

    const isAdministrator = user.userGroupId === 6;
    if (!isAdministrator) {
      const foundShop = await db.shop.findOne({ where: { userId: user.id } });
      if (!foundShop) {
        res.status(404).send({
          message: 'Shop not found',
        });
        return;
      }

      const shopId = foundShop.id;
      if (product.shopId !== shopId) {
        res.status(403).send({
          message: 'You do not have permission to see it',
        });
        return;
      }
    }

    // Format variants
    const formattedVariants = product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      options: variant.options.map((option) => ({
        id: option.id,
        name: option.name,
        image: option.image,
      })),
    }));

    // Format productVariants
    const formattedProductVariants = product.productVariants.map((pv) => {
      const options = pv.options.map((option) => ({
        variantId: option.variantId,
        name: option.variant.name,
        optionId: option.id,
        value: option.name,
      }));

      return {
        options,
        id: pv.id,
        price: pv.price,
        sku: pv.sku,
        quantity: pv.quantity,
      };
    });

    const productObject = product.toJSON();
    delete productObject.variants;
    delete productObject.productVariants;

    const responseObject = {
      ...productObject,
      variants: formattedVariants,
      productVariants: formattedProductVariants,
    };

    res.status(200).json({
      data: responseObject,
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

    const foundShop = await db.shop.findOne({ where: { userId: user.id } });
    if (!foundShop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }
    const shopId = foundShop.id;

    const {
      name,
      description,
      categoryId,
      productStatusId,
      brandId,
      images,
      video,
      logisticsServiceIds,
      attributes,
      variants,
      productVariants,
      packageWeight,
      packageWidth,
      packageHeight,
      packageLength,
      cod,
    } = req.body;

    const object = {
      uniqueId: generateUniqueId(),
      name,
      description,
      categoryId,
      productStatusId: productStatusId || 5, // 5 is Draft
      shopId,
      brandId,
      packageWeight,
      packageWidth,
      packageHeight,
      packageLength,
      cod,
    };

    const foundCategory = await db.category.findByPk(categoryId);
    if (!foundCategory) {
      res.status(404).send({
        message: 'Category not found',
      });
      return;
    }

    const createdProduct = await db.product.create(object);

    // Handle images
    if (images && images.length) {
      images.forEach(async (image) => {
        await db.product_image.create({
          file: image,
          productId: createdProduct.id,
        });
      });
    }

    // Handle video
    if (video) {
      await db.product_video.create({
        file: video,
        productId: createdProduct.id,
      });
    }

    // Handle logistics services
    if (logisticsServiceIds?.length) {
      const logisticsServices = await db.logistics_service.findAll({
        where: { id: logisticsServiceIds },
      });

      if (logisticsServices.length !== logisticsServiceIds.length) {
        res.status(404).send({
          message: 'One or more logistics services not found',
        });
        return;
      }

      await createdProduct.addLogisticsService(logisticsServices);
    }

    // Handle attributes
    if (attributes) {
      const attributeValues = attributes.map((attribute) => ({
        ...attribute,
        productId: createdProduct.id,
      }));
      await db.product_attribute.bulkCreate(attributeValues);
    }

    // Handle variants
    if (variants && productVariants) {
      if (variants.length > 3) {
        res.status(400).send({
          message: 'You cannot make more than 3 variants',
        });
        return;
      }

      // Create variants and options
      await Promise.all(variants.map(async (variant) => {
        const { name: variantName } = variant;
        const createdVariant = await db.variant.create({ name: variantName, productId: createdProduct.id });
        await variant.options.reduce(async (prevPromise, optionData) => {
          await prevPromise;
          return db.option.create({
            name: optionData.name,
            image: optionData.image,
            variantId: createdVariant.id,
            productId: createdProduct.id,
          });
        }, Promise.resolve());
        await createdProduct.addVariant(createdVariant);
      }));

      // Create product - variant combinations
      await Promise.all(productVariants.map(async (productVariant) => {
        const variantOptions = await productVariant.options.reduce(async (prevPromise, optionData) => {
          const accum = await prevPromise;
          const variant = await db.variant.findOne({ where: { name: optionData.name, productId: createdProduct.id } });
          const option = await db.option.findOne({ where: { name: optionData.value, variantId: variant.id } });
          accum.push(option);
          return accum;
        }, Promise.resolve([]));

        const createdProductVariant = await db.product_variant.create({
          price: productVariant.price,
          sku: productVariant.sku,
          quantity: productVariant.quantity,
          productId: createdProduct.id,
        });
        await createdProductVariant.setOptions(variantOptions);
      }));
    }

    res.status(201).json({
      data: {
        message: 'Product created successfully',
      },
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

    const foundShop = await db.shop.findOne({ where: { userId: user.id } });
    if (!foundShop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }
    const shopId = foundShop.id;

    const productId = req.params.id;
    if (!productId) {
      res.status(404).send({
        message: 'Product not found',
      });
      return;
    }

    const {
      name,
      description,
      categoryId,
      productStatusId,
      brandId,
      images,
      video,
      logisticsServiceIds,
      attributes,
      variants,
      productVariants,
      packageWeight,
      packageWidth,
      packageHeight,
      packageLength,
      cod,
    } = req.body;

    const object = {
      name,
      description,
      categoryId,
      productStatusId: productStatusId || 5, // 5 is Draft
      brandId,
      packageWeight,
      packageWidth,
      packageHeight,
      packageLength,
      cod,
    };

    const product = await db.product.findOne({
      where: {
        id: productId,
        shopId,
      },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const foundCategory = await db.category.findByPk(categoryId);
    if (!foundCategory) {
      res.status(404).send({
        message: 'Category not found',
      });
      return;
    }

    // Handle images
    if (images && images.length) {
      await db.product_image.destroy({ where: { productId: product.id } });
      images.forEach(async (image) => {
        await db.product_image.create({
          file: image,
          productId: product.id,
        });
      });
    }

    // Handle video
    if (video) {
      await db.product_video.destroy({ where: { productId: product.id } });
      await db.product_video.create({
        file: video,
        productId: product.id,
      });
    }

    // Handle logistics services
    if (logisticsServiceIds !== undefined) {
      if (logisticsServiceIds?.length) {
        const logisticsServices = await db.logistics_service.findAll({
          where: { id: logisticsServiceIds },
        });

        if (logisticsServices.length !== logisticsServiceIds.length) {
          res.status(404).send({
            message: 'One or more logistics services not found',
          });
          return;
        }

        await product.setLogisticsServices(logisticsServices);
      } else {
        await product.setLogisticsServices([]);
      }
    }

    // Handle attributes
    if (attributes) {
      const attributeValues = attributes.map((attribute) => ({
        ...attribute,
        productId: product.id,
      }));
      await db.product_attribute.destroy({ where: { productId: product.id } });
      await db.product_attribute.bulkCreate(attributeValues);
    }

    if (variants) {
      // Create variants and options
      if (variants.length > 3) {
        res.status(400).send({
          message: 'You cannot make more than 3 variants',
        });
        return;
      }

      const existingVariants = await db.variant.findAll({ where: { productId: product.id } });
      // const existingVariantIds = existingVariants.map((variant) => variant.id);

      // const existingOptions = await db.option.findAll({ where: { productId: product.id } });
      // const existingOptionIds = existingOptions.map((option) => option.id);

      // logger.info(existingVariantIds);
      // logger.info(existingOptionIds);

      const updatedVariants = variants.reduce((acc, variant) => {
        if (variant.id) acc[variant.id] = variant;
        return acc;
      }, {});

      logger.info(updatedVariants);

      const updatePromises = existingVariants.map(async (variant) => {
        if (updatedVariants[variant.id]) {
          // Update the variant itself
          await variant.update({
            name: updatedVariants[variant.id].name,
          });

          // Collect option IDs from the payload for comparison
          const updatedOptionIds = updatedVariants[variant.id].options.filter((option) => option.id).map((option) => option.id);
          logger.info('updatedOptionIds:', updatedOptionIds);

          // Delete options not present in the updated variant
          const deleteOptionsPromise = db.option.destroy({
            where: {
              variantId: variant.id,
              id: { [Op.notIn]: updatedOptionIds },
            },
          });

          // Update existing options and create new ones
          const updateOptionsPromise = updatedVariants[variant.id].options.map(async (option) => {
            if (option.id) {
              // Update existing option
              return db.option.update({ name: option.name, image: option.image }, { where: { id: option.id } });
            }
            // Create new option
            return db.option.create({
              name: option.name,
              image: option.image,
              variantId: variant.id,
              productId: product.id,
            });
          });

          // Wait for all option operations to complete
          await Promise.all([deleteOptionsPromise, ...updateOptionsPromise]);
          return true;
        }
        // No update for this variant, so destroy it and its options
        await db.option.destroy({ where: { variantId: variant.id } });
        await db.product_variant.destroy({ where: { variantId: variant.id } });
        return variant.destroy();
      });

      const newVariants = variants.filter((variant) => !variant.id);
      const addPromises = newVariants.map(async (variant) => {
        const createdVariant = await db.variant.create({
          name: variant.name,
          productId: product.id,
        });
        await Promise.all(variant.options.map((option) => db.option.create({
          name: option.name,
          image: option.image,
          variantId: createdVariant.id,
          productId: product.id,
        })));
      });

      await Promise.all([...updatePromises, ...addPromises]);
    }

    if (productVariants) {
      if (isOnlyUpdateProductVariants(productVariants)) {
        await Promise.all(productVariants.map(async (pv) => {
          const pvInstance = await db.product_variant.findByPk(pv.id);
          await pvInstance.update({
            price: pv.price,
            sku: pv.sku,
            quantity: pv.quantity,
          });
        }));
      } else {
        await db.product_variant.destroy({ where: { productId: product.id } });
        await Promise.all(productVariants.map(async (variantData) => {
          const variantOptions = await variantData.options.reduce(async (prevPromise, optionData) => {
            const accum = await prevPromise;
            const variant = await db.variant.findOne({ where: { name: optionData.name, productId: product.id } });
            const option = await db.option.findOne({ where: { name: optionData.value, variantId: variant.id } });
            accum.push(option);
            return accum;
          }, Promise.resolve([]));

          const productVariant = await db.product_variant.create({
            price: variantData.price,
            sku: variantData.sku,
            quantity: variantData.quantity,
            productId: product.id,
          });
          await productVariant.setOptions(variantOptions);
        }));
      }
    }

    // Update the product details
    await product.update(object);

    res.status(200).json({
      data: {
        message: 'Product updated successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const product = await db.product.findByPk(id);
    if (!product) {
      res.status(404).send({
        message: 'Product not found',
      });
      return;
    }

    const foundShop = await db.shop.findOne({ where: { userId: user.id } });
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

    await product.update({
      productStatusId: 6,
    });

    res.status(204).end();
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.bulkActiveProducts = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    const result = await db.product.update(
      { productStatusId: 1 },
      { where: { id: ids } },
    );

    res.status(200).json({
      message: `${result[0]} products have been successfully activated.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.bulkDeactiveProducts = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    const result = await db.product.update(
      { productStatusId: 2 },
      { where: { id: ids } },
    );

    res.status(200).json({
      message: `${result[0]} products have been successfully deactivated.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.bulkDeleteProducts = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    const result = await db.product.update(
      { productStatusId: 6 },
      { where: { id: ids } },
    );

    res.status(200).json({
      message: `${result[0]} products have been successfully deleted.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.bulkRecoverProducts = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    const result = await db.product.update(
      { productStatusId: 5 },
      { where: { id: ids } },
    );

    res.status(200).json({
      message: `${result[0]} products have been successfully recovered.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
