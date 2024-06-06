const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const {
      keyword,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {
      isActive: true,
    };

    if (keyword) {
      condition[Op.or] = [
        { shopName: { [Op.like]: `%${keyword}%` } },
      ];
    }

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'shopName', 'createdAt'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        ordering = [[sortField, sortOrder.toUpperCase()]];
      }
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.shop.findAndCountAll({
      where: condition,
      order: ordering,
      limit: limitPerPage,
      offset,
      attributes: ['id', 'shopName'],
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
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const shopPromise = db.shop.findOne({
      where: {
        id,
        isActive: true,
      },
      attributes: ['id', 'shopName', 'sellerBusinessTypeId', 'email', 'phone', 'createdAt'],
    });

    const productsCountPromise = db.product.count({
      where: {
        shopId: id,
        productStatusId: 1,
      },
    });

    const [shop, productsCount] = await Promise.all([shopPromise, productsCountPromise]);

    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const shopObj = shop.toJSON();
    shopObj.productsCount = productsCount || 0;

    res.json({
      data: shopObj,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
