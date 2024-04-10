const db = require('../models');

const SellerBusinessType = db.seller_business_type;

exports.findAll = (req, res) => {
  SellerBusinessType.findAll()
    .then((data) => {
      res.send({
        data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred',
      });
    });
};
