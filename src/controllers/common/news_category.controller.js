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

    const condition = {};
    if (keyword) {
      condition[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
      ];
    }

    let ordering = [['id', 'ASC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'name'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        ordering = [[sortField, sortOrder.toUpperCase()]];
      }
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.news_category.findAndCountAll({
      where: condition,
      order: ordering,
      limit: limitPerPage,
      offset,
      attributes: ['id', 'name'],
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
