const jwt = require('jsonwebtoken');

require('dotenv').config();

const apiVersion = process.env.VERSION || 'v1';

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

exports.authenticateToken = (req, res, next) => {
  const publicPaths = ['/public', '/favicon.ico', '/api-docs', `/api/${apiVersion}/auth`, `/api/${apiVersion}/register`];
  const isPublicPaths = publicPaths.some((path) => req.path.startsWith(path));
  if (req.path === '/' || (isPublicPaths && req.path !== `/api/${apiVersion}/auth/is_login`)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No access token' });
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    return next();
  });
};
