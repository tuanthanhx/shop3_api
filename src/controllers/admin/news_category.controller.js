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

exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const newsCategory = await db.news_category.findByPk(id, {
      attributes: ['id', 'name'],
    });

    if (!newsCategory) {
      res.status(404).send({
        message: 'News Category not found',
      });
      return;
    }

    res.json({
      data: newsCategory,
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
    const {
      name,
    } = req.body;

    const object = {
      name,
    };

    const duplicate = await db.news_category.findOne({ where: { name } });
    if (duplicate) {
      res.status(409).send({
        message: 'News Category already exists',
      });
      return;
    }

    await db.news_category.create(object);
    res.json({
      data: {
        message: 'News Category created successfully',
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
      name,
    } = req.body;

    const newsCategory = await db.news_category.findOne({ where: { id } });
    if (!newsCategory) {
      res.status(404).send({
        message: 'News Category not found',
      });
      return;
    }

    const duplicate = await db.news_category.findOne({
      where: {
        name,
        id: { [db.Sequelize.Op.ne]: id },
      },
    });

    if (duplicate) {
      res.status(409).send({
        message: 'News Category name already exists',
      });
      return;
    }

    const object = {
      name,
    };

    await newsCategory.update(object);
    res.json({
      data: {
        message: 'News Category updated successfully',
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

    const newsCategory = await db.news_category.findByPk(id);

    if (!newsCategory) {
      res.status(404).send({
        message: 'News Category not found',
      });
      return;
    }

    await newsCategory.destroy();

    res.json({
      data: {
        message: 'News Category deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
