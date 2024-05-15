const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const data = await db.shop.findAll({
      where: { isSubmitted: true },
    });

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

exports.verify = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isAdministrator = user.userGroupId === 6;

    if (!isAdministrator) {
      res.status(403).send({
        message: 'Permission denied',
      });
      return;
    }

    const shop = await db.shop.findByPk(id);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    await shop.update({
      isVerified: true,
      isActive: true,
    });

    res.json({
      data: {
        message: 'Verified successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.activate = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isAdministrator = user.userGroupId === 6;

    if (!isAdministrator) {
      res.status(403).send({
        message: 'Permission denied',
      });
      return;
    }

    const shop = await db.shop.findByPk(id);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    await shop.update({
      isActive: true,
    });

    res.json({
      data: {
        message: 'Verified successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.deactivate = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const isAdministrator = user.userGroupId === 6;

    if (!isAdministrator) {
      res.status(403).send({
        message: 'Permission denied',
      });
      return;
    }

    const shop = await db.shop.findByPk(id);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    await shop.update({
      isActive: false,
    });

    res.json({
      data: {
        message: 'Verified successfully',
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
