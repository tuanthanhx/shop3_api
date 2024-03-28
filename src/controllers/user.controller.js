const db = require('../models');

const User = db.user;
const { Op } = db.Sequelize;

// Create a new User
exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: 'Content can not be empty!',
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
      delete data.password;
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the User.',
      });
    });
};

// Retrieve all Users
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
    attributes: { exclude: ['password'] },
    limit: limitPerPage,
    offset,
  })
    .then((data) => {
      const { count, rows } = data;
      const totalPages = Math.ceil(count / limitPerPage);
      res.send({
        totalUsers: count,
        totalPages,
        currentPage: pageNo,
        users: rows,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving users.',
      });
    });
};

// Find a single User with an id
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

// Update a User by the id in the request
exports.update = (req, res) => {
  const { id } = req.params;

  User.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'User was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
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

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const { id } = req.params;

  User.destroy({
    where: { id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'User was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
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

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all user.',
      });
    });
};

// find all published User
exports.findAllPublished = (req, res) => {
  User.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving user.',
      });
    });
};
