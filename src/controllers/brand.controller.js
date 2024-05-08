const logger = require('../utils/logger');
const db = require('../models');

exports.findAll = async (req, res) => {
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

    const foundBrand = await db.brand.findOne({ where: { name } });
    if (foundBrand) {
      res.status(400).send({
        message: 'Brand exists',
      });
      return;
    }

    const createdBrand = await db.brand.create(object);
    res.status(200).json({
      data: createdBrand,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
