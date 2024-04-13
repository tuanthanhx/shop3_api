const { generateProductId } = require('../utils/utils');
const gcs = require('../utils/gcs');
const db = require('../models');

const Products = db.product;
const ProductImages = db.product_image;
const ProductVideos = db.product_video;
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
    } = req.body;

    const object = {
      name,
      uniqueId: generateProductId(),
      categoryId,
      description,
      price,
      productStatusId: 5,
      shopId,
    };

    const newProduct = await Products.create(object);

    const { mainImage, mainVideo, otherImages } = req.files;
    if (mainImage?.length) {
      uploadedMainImage = await gcs.upload(mainImage, 'public/product/images');
      const newMainImage = await ProductImages.create({
        file: uploadedMainImage[0],
        productId: newProduct.id,
      });
      newProduct.mainImageId = newMainImage.id;
    }
    if (mainVideo?.length) {
      uploadedMainVideo = await gcs.upload(mainVideo, 'public/product/videos');
      const newMainVideo = await ProductVideos.create({
        file: uploadedMainVideo[0],
        productId: newProduct.id,
      });
      newProduct.mainVideoId = newMainVideo.id;
    }
    if (otherImages?.length) {
      uploadedOtherImages = await gcs.upload(otherImages, 'public/product/images');
      const otherImagesArray = uploadedOtherImages.map((file) => ({
        file,
        productId: newProduct.id,
      }));
      await ProductImages.bulkCreate(otherImagesArray);
    }

    await newProduct.save();

    const foundProduct = await Products.findByPk(newProduct.id, {
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
    res.status(201).json({
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
    res.status(204).end();
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
