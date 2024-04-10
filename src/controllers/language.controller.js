const db = require('../models');

const Language = db.language;
const { Op } = db.Sequelize;

exports.findAll = (req, res) => {
  const {
    name,
    page,
    limit,
  } = req.query;

  const condition = {};
  if (name) {
    condition.name = { [Op.like]: `%${name}%` };
  }

  const pageNo = parseInt(page, 10) || 1;
  const limitPerPage = parseInt(limit, 10) || 10;
  const offset = (pageNo - 1) * limitPerPage;

  Language.findAndCountAll({
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
      res.status(500).send({
        message:
          err.message || 'Some error occurred',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Language.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Language with id=${id}`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: `Error retrieving Language with id=${id}`,
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
  };

  Language.create(object)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
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

  Language.update(object, {
    where: { id },
  })
    .then(async ([num]) => {
      if (num > 0) {
        const data = await Language.findByPk(id);
        res.send(data);
      } else {
        res.send({
          message: `Cannot updated Language with id=${id}`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: `Error updating Language with id=${id}`,
      });
    });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  Language.destroy({
    where: { id },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: 'Language was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Language with id=${id}`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: `Could not delete Language with id=${id}`,
      });
    });
};
