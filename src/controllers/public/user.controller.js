const logger = require('../../utils/logger');
const db = require('../../models');

exports.getStatistics = async (req, res) => {
  try {
    const { uuid } = req.query;

    const user = await db.user.findOne({
      where: {
        uuid,
      },
      attributes: [
        'id',
        'uuid',
      ],
      include: [
        {
          model: db.shop,
          attributes: [
            'id',
            'shopName',
            [db.sequelize.literal('(SELECT COUNT(*) FROM products AS p WHERE p.shopId = shop.id)'), 'productsCount'],
          ],
        },
      ],
    });

    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    res.json({
      data: user,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
