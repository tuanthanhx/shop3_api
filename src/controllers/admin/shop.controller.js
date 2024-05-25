const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const {
      keyword,
      status,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {};
    condition.isSubmitted = true;

    if (keyword) {
      condition[Op.or] = [
        { shopName: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (status) {
      if (status === 'active') {
        condition.isVerified = true;
        condition.isActive = true;
      }
      if (status === 'inactive') {
        condition.isVerified = true;
        condition.isActive = false;
      }
      if (status === 'review') {
        condition.isVerified = false;
        condition.isActive = false;
      }
    }

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'shopName', 'sellerBusinessTypeId', 'email', 'phone', 'isActive', 'createdAt', 'updatedAt'];
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

exports.statistics = async (req, res) => {
  try {
    const all = await db.shop.count({
      where: {
        isSubmitted: true,
      },
    });

    const active = await db.shop.count({
      where: {
        isSubmitted: true,
        isVerified: true,
        isActive: true,
      },
    });

    const inactive = await db.shop.count({
      where: {
        isSubmitted: true,
        isVerified: true,
        isActive: false,
      },
    });

    const review = await db.shop.count({
      where: {
        isSubmitted: true,
        isVerified: false,
      },
    });

    res.json({
      all,
      active,
      inactive,
      review,
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
    const shop = await db.shop.findByPk(id);

    res.json({
      data: shop,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isAdministrator = user.userGroupId === 6;

    if (!isAdministrator) {
      res.status(403).send({
        message: 'Permission denied',
      });
      return;
    }

    const shop = await db.shop.findByPk(id);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    await shop.update({
      isVerified: true,
      isActive: true,
    });

    res.json({
      data: {
        message: 'Verified successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.activate = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isAdministrator = user.userGroupId === 6;

    if (!isAdministrator) {
      res.status(403).send({
        message: 'Permission denied',
      });
      return;
    }

    const shop = await db.shop.findByPk(id);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    await shop.update({
      isActive: true,
    });

    res.json({
      data: {
        message: 'Activated successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.deactivate = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isAdministrator = user.userGroupId === 6;

    if (!isAdministrator) {
      res.status(403).send({
        message: 'Permission denied',
      });
      return;
    }

    const shop = await db.shop.findByPk(id);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    await shop.update({
      isActive: false,
    });

    res.json({
      data: {
        message: 'Deactivated successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
