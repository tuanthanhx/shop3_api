const logger = require('../../utils/logger');
const db = require('../../models');

const { Op } = db.Sequelize;

exports.index = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      page,
      limit,
    } = req.query;

    const condition = {};
    if (name) {
      condition.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      condition.email = { [Op.like]: `%${email}%` };
    }
    if (phone) {
      condition.phone = { [Op.like]: `%${phone}%` };
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.user.findAndCountAll({
      where: condition,
      limit: limitPerPage,
      offset,
    });

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

    res.json({
      totalItems: count,
      totalPages,
      currentPage: pageNo,
      data: rows,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.user.findByPk(id);

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

exports.create = async (req, res) => {
  try {
    const {
      email,
      phone,
      password,
      name,
      avatar,
      gender,
      languageId,
      currencyId,
      isActive,
    } = req.body;

    const user = await db.user.findOne({ where: { email } });
    if (user) {
      res.status(409).send({
        message: 'User exists with the provided email or phone',
      });
      return;
    }

    const object = {
      email,
      phone,
      password,
      userGroupId: 2, // Registered Users
      name,
      avatar,
      gender,
      languageId,
      currencyId,
      isActive,
    };

    const createdUser = await db.user.create(object);
    res.json({
      data: createdUser,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      phone,
      password,
      name,
      avatar,
      gender,
      languageId,
      currencyId,
      isActive,
    } = req.body;

    const user = await db.user.findOne({ where: { id } });
    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    const object = {
      email,
      phone,
      password,
      name,
      avatar,
      gender,
      languageId,
      currencyId,
      isActive,
    };

    await user.update(object);
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

exports.activate = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.user.findOne({ where: { id } });
    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    await user.update({
      isActive: true,
    });
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

exports.deactivate = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const user = await db.user.findOne({ where: { id } });
    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    await user.update({
      isActive: false,
    });
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

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.user.findByPk(id);

    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    const shop = await db.shop.findOne({ where: { userId: user.id } });
    if (shop) {
      res.status(404).send({
        message: 'User has a shop',
      });
      return;
    }

    await user.destroy();

    res.json({
      data: {
        message: 'User deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.bulkActivate = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    console.log(ids);

    const result = await db.user.update(
      { isActive: true },
      { where: { id: ids } },
    );

    res.status(200).json({
      message: `${result[0]} users have been successfully activated.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.bulkDeactivate = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    const result = await db.user.update(
      { isActive: false },
      { where: { id: ids } },
    );

    res.status(200).json({
      message: `${result[0]} users have been successfully deactivated.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.bulkDelete = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    const shops = await db.shop.findAll({
      where: { userId: ids },
    });

    if (shops?.length) {
      res.status(404).send({
        message: 'Some users have shop, cannot delete',
      });
      return;
    }

    const numDeletedRows = await db.user.destroy(
      { where: { id: ids } },
    );

    res.status(200).json({
      message: `${numDeletedRows} user${numDeletedRows !== 1 ? 's' : ''} have been successfully deleted.`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
