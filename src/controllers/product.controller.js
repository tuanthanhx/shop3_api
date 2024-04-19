const { generateProductId, isValidJson } = require('../utils/utils');
const gcs = require('../utils/gcs');
const db = require('../models');

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
      const foundShop = await db.shop.findOne({ where: { userId: user.id } });
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

    const data = await db.product.findAndCountAll({
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

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

    const formattedRows = rows.map((row) => {
      const rowData = row.toJSON();

      const variants = rowData.variants.map((variant) => ({
        name: variant.name,
        options: variant.options.map((option) => option.name),
      }));

      const productVariants = rowData.productVariants.map((variant) => {
        const options = variant.options.map((option) => ({
          name: option.variant.name,
          value: option.name,
        }));

        return {
          options,
          price: variant.price,
          sku: variant.sku,
          quantity: variant.quantity,
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
      categoryId,
      description,
      price,
      sku,
      quantity,
      productStatusId,
      variants,
      productVariants,
    } = req.body;

    const object = {
      name,
      uniqueId: generateProductId(),
      categoryId,
      description,
      price,
      sku,
      quantity,
      productStatusId: productStatusId || 5, // 5 is Draft
      shopId,
    };

    const foundCategory = await db.category.findByPk(categoryId);
    if (!foundCategory) {
      res.status(404).send({
        message: 'Category not found',
      });
      return;
    }

    const createdProduct = await db.product.create(object);

    // Handle files
    const { thumbnailImage, thumbnailVideo, images } = req.files;
    if (thumbnailImage?.length) {
      uploadedthumbnailImage = await gcs.upload(thumbnailImage, 'public/product/images');
      const [thumbnailImageFile] = uploadedthumbnailImage;
      createdProduct.thumbnailImage = thumbnailImageFile;
    }
    if (thumbnailVideo?.length) {
      uploadedthumbnailVideo = await gcs.upload(thumbnailVideo, 'public/product/videos');
      const [thumbnailVideoFile] = uploadedthumbnailVideo;
      createdProduct.thumbnailVideo = thumbnailVideoFile;
    }
    if (images?.length) {
      uploadedimages = await gcs.upload(images, 'public/product/images');
      const imagesArray = uploadedimages.map((file) => ({
        file,
        productId: createdProduct.id,
      }));
      await db.product_image.bulkCreate(imagesArray);
    }

    await createdProduct.save();

    if (isValidJson(variants) && isValidJson(productVariants)) {
      // Create variants and associate with the product
      const parsedVariants = JSON.parse(variants);
      await Promise.all(parsedVariants.map(async (variantData) => {
        const { name: variantName } = variantData;
        const variant = await db.variant.create({ name: variantName, productId: createdProduct.id });
        await Promise.all(variantData.options.map((optionName) => db.option.create({ name: optionName, variantId: variant.id, productId: createdProduct.id })));
        await createdProduct.addVariant(variant);
      }));

      // Create product variants
      const parsedProductVariants = JSON.parse(productVariants);
      await Promise.all(parsedProductVariants.map(async (variantData) => {
        const variantOptions = await Promise.all(variantData.options.map(async (optionData) => {
          const variant = await db.variant.findOne({ where: { name: optionData.name, productId: createdProduct.id } });
          return db.option.findOne({ where: { name: optionData.value, variantId: variant.id } });
        }));
        const productVariant = await db.product_variant.create({
          price: variantData.price,
          sku: variantData.sku,
          quantity: variantData.quantity,
          productId: createdProduct.id,
        });
        await productVariant.setOptions(variantOptions);
      }));
    }

    const foundProduct = await db.product.findByPk(createdProduct.id, {
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

    // Format variants
    const formattedVariants = foundProduct.variants.map((variant) => ({
      name: variant.name,
      options: variant.options.map((option) => option.name),
    }));

    // Format productVariants
    const formattedProductVariants = foundProduct.productVariants.map((variant) => {
      const options = variant.options.map((option) => ({
        // name: foundProduct.variants.find((obj) => obj.id === option.variantId)?.name,
        name: option.variant.name,
        value: option.name,
      }));
      return {
        options,
        price: variant.price,
        sku: variant.sku,
        quantity: variant.quantity,
      };
    });

    const productObject = foundProduct.toJSON();
    delete productObject.variants;
    delete productObject.productVariants;

    const responseObject = {
      ...productObject,
      variants: formattedVariants,
      productVariants: formattedProductVariants,
    };

    res.status(201).json({
      data: responseObject,
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

    const {
      name,
      categoryId,
      description,
      price,
      sku,
      quantity,
      productStatusId,
      variants,
      productVariants,
    } = req.body;

    const object = {
      name,
      categoryId,
      description,
      price,
      sku,
      quantity,
      productStatusId: productStatusId || 5, // 5 is Draft
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

    // Handle files
    const { thumbnailImage, thumbnailVideo, images } = req.files;
    if (thumbnailImage?.length) {
      uploadedthumbnailImage = await gcs.upload(thumbnailImage, 'public/product/images');
      const [thumbnailImageFile] = uploadedthumbnailImage;
      object.thumbnailImage = thumbnailImageFile;
    }
    if (thumbnailVideo?.length) {
      uploadedthumbnailVideo = await gcs.upload(thumbnailVideo, 'public/product/videos');
      const [thumbnailVideoFile] = uploadedthumbnailVideo;
      object.thumbnailVideo = thumbnailVideoFile;
    }
    if (images?.length) {
      await db.product_image.destroy({ where: { productId: product.id } });
      uploadedimages = await gcs.upload(images, 'public/product/images');
      const imagesArray = uploadedimages.map((file) => ({
        file,
        productId: product.id,
      }));
      await db.product_image.bulkCreate(imagesArray);
    }

    // Update the product details
    await product.update(object);

    // if (variants && productVariants) {
    //   await db.variant.destroy({ where: { productId: product.id } });
    //   await db.option.destroy({ where: { productId: product.id } });
    //   await db.product_variant.destroy({ where: { productId: product.id } });

    //   // Create variants and associate with the product
    //   const parsedVariants = JSON.parse(variants);
    //   parsedVariants.forEach(async (variantData) => {
    //     const { name: variantName } = variantData;
    //     const variant = await db.variant.create({ name: variantName, productId: product.id });

    //     variantData.options.forEach(async (optionName) => {
    //       await db.option.create({ name: optionName, variantId: variant.id, productId: product.id });
    //     });

    //     await product.addVariant(variant);
    //   });

    //   // Create variant combination
    //   const parsedProductVariants = JSON.parse(productVariants);
    //   parsedProductVariants.forEach(async (variantData) => {
    //     const variantOptions = [];

    //     // Find options for each variant
    //     variantData.options.forEach(async (optionData) => {
    //       const variant = await db.variant.findOne({ where: { name: optionData.name, productId: product.id } });
    //       const option = await db.option.findOne({ where: { name: optionData.value, variantId: variant.id } });
    //       variantOptions.push(option);
    //     });

    //     const productVariant = await db.product_variant.create({
    //       price: variantData.price,
    //       sku: variantData.sku,
    //       quantity: variantData.quantity,
    //       productId: product.id,
    //     });

    //     await productVariant.setOptions(variantOptions);
    //   });
    // }

    const foundProduct = await db.product.findByPk(product.id, {
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

    res.status(200).json({
      data: foundProduct,
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
