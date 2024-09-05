const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const wallet = await db.wallet.findOne({
      where: {
        userId: user.id,
      },
      attributes: ['id', 'address', 'balance'],
      include: [{
        model: db.wallet_type,
        as: 'walletType',
        attributes: ['name', 'unit'],
      }],
    });

    const walletObj = wallet.toJSON();
    walletObj.name = walletObj.walletType.name;
    walletObj.unit = walletObj.walletType.unit;
    delete walletObj.walletType;

    res.send({
      data: walletObj,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
