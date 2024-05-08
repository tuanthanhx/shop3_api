const logger = require('../utils/logger');
const db = require('../models');

const Categories = db.category;

exports.findAll = async (req, res) => {
  const { parentId } = req.query;
  let categories;

  try {
    if (parentId) {
      categories = await Categories.findAll({
        where: { parentId },
      });
    } else {
      categories = await Categories.findAll({
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
  const { name, parentId } = req.body;

  const object = {
    name,
    parentId,
  };

  try {
    const newCategory = await Categories.create(object);
    res.status(201).json(newCategory);
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

    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) {
      res.status(400).send({
        message: 'Category not found',
      });
      return;
    }

    foundCategory.name = name;
    foundCategory.parentId = parentId;
    await category.save();
    res.json({
      data: foundCategory,
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
    const foundCategory = await Category.findByPk(id);
    if (!foundCategory) {
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
