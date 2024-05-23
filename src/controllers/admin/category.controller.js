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
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.category.findAndCountAll({
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

exports.create = async (req, res) => {
  try {
    const {
      name,
      image,
      parentId,
    } = req.body;

    const object = {
      name,
      image,
      parentId,
    };

    if (parentId) {
      const category = await db.category.findByPk(parentId);
      if (!category) {
        res.status(400).send({
          message: 'Cannot find the parent category',
        });
        return;
      }
    }

    await db.category.create(object);
    res.status(201).json({
      data: {
        message: 'Category created successfully',
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
      image,
      parentId,
    } = req.body;

    if (id === parentId) {
      res.status(400).send({
        message: 'Parent category cannot be same as this category id',
      });
      return;
    }

    const category = await db.category.findByPk(id);
    if (!category) {
      res.status(400).send({
        message: 'Category not found',
      });
      return;
    }

    const parentCategory = await db.category.findByPk(parentId);
    if (!parentCategory) {
      res.status(400).send({
        message: 'Cannot find the parent category',
      });
      return;
    }

    await category.update({
      name,
      image,
      parentId,
    });

    res.json({
      data: {
        message: 'Category updated successfully',
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
    const category = await db.category.findByPk(id);
    if (!category) {
      res.status(400).send({
        message: 'Category not found',
      });
      return;
    }
    await category.destroy();
    res.status(204).end();
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.findAllAttributes = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await db.category.findByPk(id, {
      include: {
        model: db.attribute,
        through: { attributes: [] },
        attributes: ['id', 'name'],
        include: {
          model: db.attribute_value,
          as: 'attributeValues',
          attributes: ['id', 'name'],
        },
      },
    });

    if (!category) {
      res.status(404).send('Category not found');
      return;
    }

    res.json({
      data: category.attributes,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
