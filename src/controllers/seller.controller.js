const db = require('../models');

const SellerBusinessTypes = db.seller_business_type;

exports.getBusinessTypes = async (req, res) => {
  try {
    const data = await SellerBusinessTypes.findAll();
    res.send({
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
