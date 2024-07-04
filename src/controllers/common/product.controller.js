const { getMinMaxPrice, tryParseJSON } = require('../../utils/utils');
const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const {
      keyword,
      minPrice,
      maxPrice,
      categoryId,
      codStatus,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {
      productStatusId: 1,
    };

    if (keyword) {
      condition[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
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

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'name', 'uniqueId', 'price', 'createdAt', 'updatedAt'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        if (sortField === 'price') {
          ordering = [[{ model: db.product_variant, as: 'productVariants' }, sortField, sortOrder.toUpperCase()]];
        } else {
          ordering = [[sortField, sortOrder.toUpperCase()]];
        }
      }
    }

    const includeOptions = [
      {
        model: db.shop,
        where: { isActive: true },
        attributes: ['id', 'shopName'],
      },
      {
        model: db.category,
        as: 'category',
        attributes: ['id', 'name'],
      },
      {
        model: db.product_image,
        as: 'productImages',
        attributes: ['id', 'file'],
        separate: true,
        limit: 1,
      },
      {
        model: db.product_variant,
        as: 'productVariants',
        required: sortField === 'price',
        separate: true,
      },
    ];

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;

    const queryOptions = {
      where: condition,
      order: ordering,
      distinct: true,
      include: includeOptions,
      attributes: { exclude: ['productStatusId', 'categoryId', 'brandId', 'shopId', 'description', 'packageWeight', 'packageWidth', 'packageHeight', 'packageLength', 'cod'] },
    };

    if (limitPerPage !== -1) {
      const effectiveLimit = limitPerPage;
      const offset = (pageNo - 1) * effectiveLimit;
      queryOptions.limit = effectiveLimit;
      queryOptions.offset = offset;
    }

    const data = await db.product.findAndCountAll(queryOptions);

    const { count, rows } = data;
    const totalPages = limitPerPage === -1 ? 1 : Math.ceil(count / limitPerPage);

    const formattedRows = rows?.map((row) => {
      const rowData = row.toJSON();

      const variants = rowData.variants?.map((variant) => ({
        id: variant.id,
        name: variant.name,
        options: variant.options?.map((option) => ({
          id: option.id,
          name: option.name,
          image: option.image,
        })),
      }));

      const productVariants = rowData.productVariants?.map((pv) => {
        const options = pv.options?.map((option) => ({
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

      const minMaxPrice = getMinMaxPrice(rowData.productVariants);

      delete rowData.variants;
      delete rowData.productVariants;

      return {
        ...rowData,
        ...minMaxPrice,
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

    const product = await db.product.findByPk(id, {
      where: {
        productStatusId: 1,
      },
      include: [
        {
          model: db.category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: db.brand,
          as: 'brand',
          attributes: ['id', 'name'],
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
          separate: true,
          include: {
            model: db.option,
          },
        },
        {
          model: db.product_variant,
          as: 'productVariants',
          separate: true,
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
      attributes: { exclude: ['productStatusId', 'categoryId', 'brandId', 'description'] },
    });

    const productDescription = await db.product.findByPk(id, {
      attributes: ['description'],
    });

    if (!product) {
      res.status(404).send({
        message: 'Product not found',
      });
      return;
    }

    const productImages = await product?.getProductImages({
      attributes: ['id', 'file'],
    });

    const productVideos = await product?.getProductVideos({
      attributes: ['id', 'file'],
    });

    // Format variants
    const formattedVariants = product.variants?.map((variant) => ({
      id: variant.id,
      name: variant.name,
      options: variant.options?.map((option) => ({
        id: option.id,
        name: option.name,
        image: option.image,
      })),
    }));

    // Format productVariants
    const formattedProductVariants = product.productVariants?.map((pv) => {
      const options = pv.options?.map((option) => ({
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

    const minMaxPrice = getMinMaxPrice(product.productVariants);

    const formattedProductAttributes = product.productAttributes.map((attr) => ({
      name: attr.name,
      value: tryParseJSON(attr.value),
    }));

    const productObject = product.toJSON();
    const productDescriptionObject = productDescription.toJSON();
    delete productObject.variants;
    delete productObject.productVariants;
    delete productObject.productAttributes;

    const responseObject = {
      ...productObject,
      ...minMaxPrice,
      description: productDescriptionObject?.description,
      productImages,
      productVideos,
      variants: formattedVariants,
      productVariants: formattedProductVariants,
      productAttributes: formattedProductAttributes,
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

exports.getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rate,
      page,
      limit,
    } = req.query;

    const product = await db.product.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      res.status(404).send({
        message: 'Product not found',
      });
      return;
    }

    const productId = product?.id;

    const condition = {};
    if (rate) {
      condition.rate = rate;
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;

    const ordering = [['id', 'DESC']];

    const queryOptions = {
      where: condition,
      order: ordering,
      attributes: ['createdAt', 'updatedAt', 'rate', 'message', 'images', 'videos'],
      include: [
        {
          model: db.user,
          attributes: ['name', 'avatar', 'phone', 'email'],
        },
        {
          model: db.order_item,
          as: 'orderItem',
          where: {
            productId,
          },
          attributes: ['productVariant'],
        },
      ],
    };

    if (limitPerPage !== -1) {
      const effectiveLimit = limitPerPage;
      const offset = (pageNo - 1) * effectiveLimit;
      queryOptions.limit = effectiveLimit;
      queryOptions.offset = offset;
    }

    const data = await db.review.findAndCountAll(queryOptions);

    const { count, rows } = data;
    const totalPages = limitPerPage === -1 ? 1 : Math.ceil(count / limitPerPage);

    const formattedRows = rows.map((row) => {
      const rowObj = row.toJSON();
      if (rowObj.orderItem?.productVariant) {
        rowObj.productVariant = tryParseJSON(rowObj.orderItem?.productVariant);
        delete rowObj.orderItem;
      }
      return {
        ...rowObj,
        images: tryParseJSON(rowObj.images),
        videos: tryParseJSON(rowObj.videos),
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
