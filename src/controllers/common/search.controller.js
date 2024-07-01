const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.getHints = async (req, res) => {
  try {
    const { keyword } = req.query;

    const condition = {
      productStatusId: 1,
    };

    if (!keyword) {
      res.json({
        data: [],
      });
      return;
    }

    condition[Op.or] = [
      { name: { [Op.like]: `%${keyword}%` } },
    ];

    const includeOptions = [
      {
        model: db.shop,
        where: { isActive: true },
        attributes: [],
      },
    ];

    const ordering = [['name', 'ASC']];

    const products = await db.product.findAll({
      where: condition,
      order: ordering,
      include: includeOptions,
      attributes: [
        'name',
      ],
      limit: 40,
    });

    const suggestionsSet = new Set();

    products.forEach((product) => {
      suggestionsSet.add(product.name);
    });

    const suggestionsArray = Array.from(suggestionsSet).slice(0, 20);

    res.json({
      data: suggestionsArray,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
