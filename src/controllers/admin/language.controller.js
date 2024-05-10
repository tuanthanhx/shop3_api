const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const {
      name,
      page,
      limit,
    } = req.query;

    const condition = {};
    if (name) {
      condition.name = { [db.Sequelize.like]: `%${name}%` };
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.language.findAndCountAll({
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

    const language = await db.language.findByPk(id);

    if (!language) {
      res.status(404).send({
        message: 'Language not found',
      });
      return;
    }

    res.json({
      data: language,
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
    } = req.body;

    const language = await db.language.findOne({ where: { name } });
    if (language) {
      res.status(409).send({
        message: 'Language exists with the provided name',
      });
      return;
    }

    const object = {
      name,
    };

    const createdLanguage = await db.language.create(object);
    res.json({
      data: createdLanguage,
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
    } = req.body;

    const language = await db.language.findOne({ where: { id } });
    if (!language) {
      res.status(404).send({
        message: 'Language not found',
      });
      return;
    }

    const duplicate = await db.language.findOne({
      where: {
        name,
        id: { [db.Sequelize.ne]: id },
      },
    });

    if (duplicate) {
      res.status(409).send({
        message: 'Language name already exists',
      });
      return;
    }

    const object = {
      name,
    };

    await language.update(object);
    res.json({
      data: language,
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

    const language = await db.language.findByPk(id);

    if (!language) {
      res.status(404).send({
        message: 'Language not found',
      });
      return;
    }

    await language.destroy();

    res.json({
      data: {
        message: 'Language deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
