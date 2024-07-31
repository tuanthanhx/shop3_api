const logger = require('../../utils/logger');
const db = require('../../models');

exports.getOrderStatuses = async (req, res) => {
  try {
    const orderStatuses = await db.order_status.findAll({
      attributes: ['id', 'name', 'description'],
    });
    res.json({
      data: orderStatuses,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
