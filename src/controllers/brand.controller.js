const db = require('../models');

exports.findAll = async (req, res) => {
  try {
    const data = await db.brand.findAll();
    res.send({
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
