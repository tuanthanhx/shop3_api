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
        { description: { [Op.like]: `%${keyword}%` } },
      ];
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
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.brand.findAndCountAll({
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

exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await db.brand.findByPk(id);

    if (!brand) {
      res.status(404).send({
        message: 'Brand not found',
      });
      return;
    }

    res.json({
      data: brand,
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
      description,
    } = req.body;

    const object = {
      name,
      description,
      userId: null,
    };

    const duplicate = await db.brand.findOne({ where: { name } });
    if (duplicate) {
      res.status(409).send({
        message: 'Brand name already exists',
      });
      return;
    }

    const brand = await db.brand.create(object);
    res.status(200).json({
      data: brand,
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
      description,
    } = req.body;

    const brand = await db.brand.findOne({ where: { id } });
    if (!brand) {
      res.status(404).send({
        message: 'Brand not found',
      });
      return;
    }

    const duplicate = await db.brand.findOne({
      where: {
        name,
        id: { [db.Sequelize.Op.ne]: id },
      },
    });

    if (duplicate) {
      res.status(409).send({
        message: 'Brand name already exists',
      });
      return;
    }

    const object = {
      name,
      description,
    };

    await brand.update(object);
    res.json({
      data: brand,
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

    const brand = await db.brand.findByPk(id);

    if (!brand) {
      res.status(404).send({
        message: 'Brand not found',
      });
      return;
    }

    await brand.destroy();

    res.json({
      data: {
        message: 'Brand deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
