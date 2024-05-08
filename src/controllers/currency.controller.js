const logger = require('../utils/logger');
const db = require('../models');

const Currency = db.currency;
const { Op } = db.Sequelize;

exports.findAll = (req, res) => {
  const {
    name,
    code,
    page,
    limit,
  } = req.query;

  const condition = {};
  if (name) {
    condition.name = { [Op.like]: `%${name}%` };
  }
  if (code) {
    condition.code = { [Op.like]: `%${code}%` };
  }

  const pageNo = parseInt(page, 10) || 1;
  const limitPerPage = parseInt(limit, 10) || 10;
  const offset = (pageNo - 1) * limitPerPage;

  Currency.findAndCountAll({
    where: condition,
    limit: limitPerPage,
    offset,
  })
    .then((data) => {
      const { count, rows } = data;
      const totalPages = Math.ceil(count / limitPerPage);
      res.send({
        totalItems: count,
        totalPages,
        currentPage: pageNo,
        data: rows,
      });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({
        message:
          err.message || 'Some error occurred',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Currency.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Currency with id=${id}`,
        });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({
        message: `Error retrieving Currency with id=${id}`,
      });
    });
};

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: 'Name cannot be empty',
    });
    return;
  }

  const object = {
    name: req.body.name,
    code: req.body.code,
    symbol: req.body.symbol,
  };

  Currency.create(object)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({
        message:
          err.message || 'Some error occurred',
      });
    });
};

exports.update = (req, res) => {
  const { id } = req.params;

  const object = {
    name: req.body.name,
  };

  Currency.update(object, {
    where: { id },
  })
    .then(async ([num]) => {
      if (num > 0) {
        const data = await Currency.findByPk(id);
        res.send(data);
      } else {
        res.send({
          message: `Cannot updated Currency with id=${id}`,
        });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({
        message: `Error updating Currency with id=${id}`,
      });
    });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  Currency.destroy({
    where: { id },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: 'Currency was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Currency with id=${id}`,
        });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({
        message: `Could not delete Currency with id=${id}`,
      });
    });
};
