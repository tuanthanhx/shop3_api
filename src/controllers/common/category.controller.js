const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const {
      keyword,
      parentId,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {};
    if (keyword) {
      condition[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (parentId) {
      condition.parentId = parentId;
    } else {
      condition.parentId = null;
    }

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'name', 'createdAt', 'updatedAt'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        ordering = [[sortField, sortOrder.toUpperCase()]];
      }
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;

    const queryOptions = {
      where: condition,
      order: ordering,
    };

    if (limitPerPage !== -1) {
      const effectiveLimit = limitPerPage;
      const offset = (pageNo - 1) * effectiveLimit;
      queryOptions.limit = effectiveLimit;
      queryOptions.offset = offset;
    }

    const data = await db.category.findAndCountAll(queryOptions);

    const { count, rows } = data;
    const totalPages = limitPerPage === -1 ? 1 : Math.ceil(count / limitPerPage);

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

    const category = await db.category.findByPk(id);

    if (!category) {
      res.status(404).send({
        message: 'Category not found',
      });
      return;
    }

    res.json({
      data: category,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
