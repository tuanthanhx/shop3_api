const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const data = await db.brand.findAll();
    res.send({
      data,
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
    const { user } = req;

    const {
      name,
      description,
    } = req.body;

    const object = {
      name,
      description,
      userId: user.id,
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
