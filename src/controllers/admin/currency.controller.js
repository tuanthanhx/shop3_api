const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const {
      name,
      code,
      page,
      limit,
    } = req.query;

    const condition = {};
    if (name) {
      condition.name = { [db.Sequelize.like]: `%${name}%` };
    }
    if (code) {
      condition.code = { [db.Sequelize.Op.like]: `%${code}%` };
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.currency.findAndCountAll({
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

    const currency = await db.currency.findByPk(id);

    if (!currency) {
      res.status(404).send({
        message: 'Currency not found',
      });
      return;
    }

    res.json({
      data: currency,
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
      name,
      code,
      symbol,
    } = req.body;

    const duplicate = await db.currency.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { name },
          { code },
        ],
      },
    });

    if (duplicate) {
      res.status(409).send({
        message: 'Currency name or code already exists',
      });
      return;
    }

    const object = {
      name,
      code,
      symbol,
    };

    const currency = await db.currency.create(object);
    res.json({
      data: currency,
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
      name,
      code,
      symbol,
    } = req.body;

    const currency = await db.currency.findOne({ where: { id } });
    if (!currency) {
      res.status(404).send({
        message: 'Currency not found',
      });
      return;
    }

    const duplicate = await db.currency.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { name },
          { code },
        ],
        id: { [db.Sequelize.Op.ne]: id },
      },
    });

    if (duplicate) {
      res.status(409).send({
        message: 'Currency name or code already exists',
      });
      return;
    }

    const object = {
      name,
      code,
      symbol,
    };

    await currency.update(object);
    res.json({
      data: currency,
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

    const currency = await db.currency.findByPk(id);

    if (!currency) {
      res.status(404).send({
        message: 'Currency not found',
      });
      return;
    }

    await currency.destroy();

    res.json({
      data: {
        message: 'Currency deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
