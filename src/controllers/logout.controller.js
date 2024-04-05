const db = require('../models');

require('dotenv').config();

const UserRefreshToken = db.user_refresh_token;

exports.logout = async (req, res) => {
  const { id } = req.user;
  if (id) {
    await UserRefreshToken.destroy({ where: { user_id: id } });
  }
  res.status(204).end();
};
