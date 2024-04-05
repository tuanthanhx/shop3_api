// const jwt = require('jsonwebtoken');

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

  if (token == null) {
    return res.sendStatus(401);
  }

  return next();
};
