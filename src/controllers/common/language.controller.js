const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const languages = await db.language.findAll({
      attributes: ['id', 'name'],
    });
    res.json({
      data: languages,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
