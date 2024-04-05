const jwt = require('jsonwebtoken');

require('dotenv').config();

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

exports.authenticateToken = (req, res, next) => {
  const publicPaths = ['/public', '/favicon.ico', '/api/auth', '/api-docs', '/api/register', '/api/login'];
  const isPublicPaths = publicPaths.some((path) => req.path.startsWith(path));
  if (isPublicPaths) {
    return next();
  }
  if (req.path === '/') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    return next();
  });
};
