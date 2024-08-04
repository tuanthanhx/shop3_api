const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const {
      keyword,
      catId,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {
      isPublished: true,
    };

    if (keyword) {
      condition[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const whereClause = {};
    const whereRequire = !!(catId);

    if (catId) {
      whereClause.id = catId;
    }

    const includeOptions = [
      {
        model: db.news_category,
        as: 'newsCategories',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        where: whereClause,
        required: whereRequire,
      },
    ];

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'title', 'excerpt', 'thumbnail', 'createdAt'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        ordering = [[sortField, sortOrder.toUpperCase()]];
      }
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.news.findAndCountAll({
      where: condition,
      order: ordering,
      limit: limitPerPage,
      offset,
      distinct: true,
      attributes: ['id', 'title', 'excerpt', 'thumbnail', 'createdAt'],
      include: includeOptions,
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

    const news = await db.news.findOne({
      where: {
        id,
        isPublished: true,
      },
      attributes: ['id', 'title', 'excerpt', 'content', 'thumbnail', 'image', 'createdAt', 'updatedAt'],
      include: [{
        model: db.news_category,
        as: 'newsCategories',
        attributes: ['id', 'name'],
        through: { attributes: [] },
      }],
    });

    if (!news) {
      res.status(404).send({
        message: 'News not found',
      });
      return;
    }

    res.json({
      data: news,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
