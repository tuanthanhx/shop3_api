const logger = require('../../utils/logger');
const db = require('../../models');

exports.findAll = async (req, res) => {
  const { parentId } = req.query;
  let categories;

  try {
    if (parentId) {
      categories = await db.category.findAll({
        where: { parentId },
      });
    } else {
      categories = await db.category.findAll({
        where: { parentId: null },
      });
    }
    res.json({
      data: categories,
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
    const { name, parentId } = req.body;

    const object = {
      name,
      parentId,
    };

    const category = await db.category.findByPk(parentId);
    if (!category) {
      res.status(400).send({
        message: 'Cannot find the parent category',
      });
      return;
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
    const { name, parentId } = req.body;

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
