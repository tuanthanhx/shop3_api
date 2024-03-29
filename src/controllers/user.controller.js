const db = require('../models');

const User = db.user;
const { Op } = db.Sequelize;

exports.findAll = (req, res) => {
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

  User.findAndCountAll({
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
          err.message || 'Some error occurred.',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: `Error retrieving User with id=${id}`,
      });
    });
};

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: 'Name cannot be empty.',
    });
    return;
  }

  const object = {
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    avatar: req.body.avatar,
    gender: req.body.gender,
    dob: req.body.dob,
    language_id: req.body.language_id,
    currency_id: req.body.currency_id,
    is_phone_validated: false,
    is_email_validated: false,
    is_active: true,
    last_login: null,
  };

  User.create(object)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred.',
      });
    });
};

exports.update = (req, res) => {
  const { id } = req.params;

  const object = req.body;

  User.update(object, {
    where: { id },
  })
    .then(async ([num]) => {
      if (num > 0) {
        const data = await User.findByPk(id);
        res.send(data);
      } else {
        res.send({
          message: `Cannot updated User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: `Error updating User with id=${id}`,
      });
    });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  User.destroy({
    where: { id },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: 'User was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: `Could not delete User with id=${id}`,
      });
    });
};
