const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const { parentId } = req.query;
    let categories;

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

exports.getAttributes = async (req, res) => {
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
