// TODO: Use passport.js to handle auth later

// const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const publicPaths = ['/api/languages', '/api/login'];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  return next();
};
