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
        id: variant.id,
        name: variant.name,
        options: variant.options.map((option) => ({
          id: option.id,
          name: option.name,
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
      const parsedVariants = JSON.parse(variants);
      if (parsedVariants.length > 3) {
        res.status(400).send({
          message: 'You cannot make more than 3 variants',
        });
        return;
      }

      // Create variants and associate with the product
      await Promise.all(parsedVariants.map(async (variantData) => {
        const { name: variantName } = variantData;
        const variant = await db.variant.create({ name: variantName, productId: createdProduct.id });
        await variantData.options.reduce(async (prevPromise, optionName) => {
          await prevPromise;
          return db.option.create({ name: optionName, variantId: variant.id, productId: createdProduct.id });
        }, Promise.resolve());
        await createdProduct.addVariant(variant);
      }));

      // Create product variants
      const parsedProductVariants = JSON.parse(productVariants);
      await Promise.all(parsedProductVariants.map(async (variantData) => {
        const variantOptions = await variantData.options.reduce(async (prevPromise, optionData) => {
          const accum = await prevPromise;
          const variant = await db.variant.findOne({ where: { name: optionData.name, productId: createdProduct.id } });
          const option = await db.option.findOne({ where: { name: optionData.value, variantId: variant.id } });
          accum.push(option);
          return accum;
        }, Promise.resolve([]));

        const productVariant = await db.product_variant.create({
          price: variantData.price,
          sku: variantData.sku,
          quantity: variantData.quantity,
          productId: createdProduct.id,
        });
        await productVariant.setOptions(variantOptions);
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

    if (variants) {
      // Create variants and associate with the product
      const parsedVariants = JSON.parse(variants);
      if (parsedVariants.length > 3) {
        res.status(400).send({
          message: 'You cannot make more than 3 variants',
        });
        return;
      }

      const existingVariants = await db.variant.findAll({ where: { productId: product.id } });
      const existingVariantIds = existingVariants.map((variant) => variant.id);

      const existingOptions = await db.option.findAll({ where: { productId: product.id } });
      const existingOptionIds = existingOptions.map((option) => option.id);

      console.log(existingVariantIds);
      console.log(existingOptionIds);

      const updatedVariants = parsedVariants.reduce((acc, variant) => {
        if (variant.id) acc[variant.id] = variant;
        return acc;
      }, {});

      const updatePromises = existingVariants.map(async (variant) => {
        if (updatedVariants[variant.id]) {
          // Update the variant itself
          await variant.update({
            name: updatedVariants[variant.id].name,
          });

          // Collect option IDs from the payload for comparison
          const updatedOptionIds = updatedVariants[variant.id].options.filter((option) => option.id).map((option) => option.id);
          console.log('updatedOptionIds:', updatedOptionIds);

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
              return db.option.update({ name: option.name }, { where: { id: option.id } });
            }
            // Create new option
            return db.option.create({
              name: option.name,
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
        // TODO: Remove product_variant and product_variant_map that related to that deleted variant too later.
        return variant.destroy();
      });

      const newVariants = parsedVariants.filter((variant) => !variant.id);
      const addPromises = newVariants.map(async (variant) => {
        const createdVariant = await db.variant.create({
          name: variant.name,
          productId: product.id,
        });
        await Promise.all(variant.options.map((option) => db.option.create({
          name: option.name,
          variantId: createdVariant.id,
          productId: product.id,
        })));
      });

      await Promise.all([...updatePromises, ...addPromises]);
    }

    if (productVariants) {
      const parsedProductVariants = JSON.parse(productVariants);

      // TODO: If only updates
      // await Promise.all(parsedProductVariants.map(async (pv) => {
      //   const pvInstance = await db.product_variant.findByPk(pv.id);
      //   await pvInstance.update({
      //     price: pv.price,
      //     sku: pv.sku,
      //     quantity: pv.quantity,
      //   });
      // }));

      await db.product_variant.destroy({ where: { productId: product.id } });
      await Promise.all(parsedProductVariants.map(async (variantData) => {
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

    // const foundProduct = await db.product.findByPk(product.id, {
    //   include: [
    //     {
    //       model: db.product_image,
    //       as: 'productImages',
    //       attributes: ['id', 'file'],
    //     },
    //     {
    //       model: db.product_video,
    //       as: 'productVideos',
    //       attributes: ['id', 'file'],
    //     },
    //     {
    //       model: db.variant,
    //       include: {
    //         model: db.option,
    //       },
    //     },
    //     {
    //       model: db.product_variant,
    //       as: 'productVariants',
    //       include: [
    //         {
    //           model: db.option,
    //           include: {
    //             model: db.variant,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });

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
