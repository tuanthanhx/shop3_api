const jwt = require('jsonwebtoken');
const db = require('../models');

require('dotenv').config();

const User = db.user;
const UserRefreshToken = db.user_refresh_token;
const { Op } = db.Sequelize;

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

exports.login = async (req, res) => {
  if (!req.body.email && !req.body.phone) {
    res.status(400).send({
      message: 'Need to provide at least an email address or a phone number',
    });
    return;
  }

  const { email, phone, password } = req.body;

  let whereCondition = {};
  if (email && phone) {
    whereCondition = { [Op.or]: [{ email }, { phone }] };
  } else if (email) {
    whereCondition = { email };
  } else if (phone) {
    whereCondition = { phone };
  }

  try {
    const user = await User.findOne({ where: whereCondition, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret, { expiresIn: '30d' });

    const findToken = await UserRefreshToken.findOne({ where: { user_id: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, user_id: user.id });
    }

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token is not valid 1' });
    return;
  }

  try {
    const findRefreshToken = await UserRefreshToken.findOne({ where: { token: refreshToken } });
    if (!findRefreshToken) {
      res.status(401).json({ error: 'Refresh token is not valid 2' });
      return;
    }

    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token is not valid 3' });
      }
      const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '15m' });
      return res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Refresh token is not valid 4' });
  }
};
