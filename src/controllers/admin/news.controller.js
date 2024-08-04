const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const {
      keyword,
      catId,
      isPublished,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {};
    if (keyword) {
      condition[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (isPublished !== undefined) {
      condition.isPublished = isPublished;
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
      attributes: ['id', 'title', 'excerpt', 'thumbnail', 'isPublished', 'createdAt'],
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

    const news = await db.news.findByPk(id, {
      attributes: ['id', 'title', 'excerpt', 'content', 'thumbnail', 'image', 'isPublished', 'createdAt', 'updatedAt'],
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

exports.create = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      title,
      excerpt,
      content,
      catIds,
      thumbnail,
      image,
      isPublished,
    } = req.body;

    const object = {
      title,
      excerpt,
      content,
      thumbnail,
      image,
      isPublished,
      userId,
    };

    const createdNews = await db.news.create(object);

    if (catIds && catIds.length > 0) {
      const categories = await db.news_category.findAll({ where: { id: catIds } });
      await createdNews.setNewsCategories(categories);
    }

    res.json({
      data: {
        message: 'News created successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      excerpt,
      content,
      catIds,
      thumbnail,
      image,
      isPublished,
    } = req.body;

    const news = await db.news.findOne({ where: { id } });
    if (!news) {
      res.status(404).send({
        message: 'News not found',
      });
      return;
    }

    const object = {
      title,
      excerpt,
      content,
      thumbnail,
      image,
      isPublished,
    };

    await news.update(object);

    if (catIds && catIds.length > 0) {
      const newsCategories = await db.news_category.findAll({ where: { id: catIds } });
      await news.setNewsCategories(newsCategories);
    }

    res.json({
      data: {
        message: 'News updated successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await db.news.findByPk(id);

    if (!news) {
      res.status(404).send({
        message: 'News not found',
      });
      return;
    }

    await news.destroy();

    res.json({
      data: {
        message: 'News deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.publish = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await db.news.findByPk(id);
    if (!news) {
      res.status(404).send({
        message: 'News not found',
      });
      return;
    }

    await news.update({
      isPublished: true,
    });

    res.json({
      data: {
        message: 'News published successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.unpublish = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await db.news.findByPk(id);
    if (!news) {
      res.status(404).send({
        message: 'News not found',
      });
      return;
    }

    await news.update({
      isPublished: false,
    });

    res.json({
      data: {
        message: 'News unpublished successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
