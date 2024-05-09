const jwt = require('jsonwebtoken');

require('dotenv').config();

const apiVersion = process.env.VERSION || 'v1';

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

exports.authenticateToken = (req, res, next) => {
  const publicPaths = [
    '/favicon.ico',
    '/public',
    '/docs',
    '/api-docs',
    `/api-common/${apiVersion}/auth`,
    `/api-common/${apiVersion}/register`,
  ];
  const adminPaths = [
    '/api-admin',
  ];
  const isPublicPaths = publicPaths.some((path) => req.path.startsWith(path));
  const isAdminPaths = adminPaths.some((path) => req.path.startsWith(path));

  if (
    req.path === '/' || (
      isPublicPaths
      && req.path !== `/api-common/${apiVersion}/auth/is_login`
      && req.path !== `/api-common/${apiVersion}/auth/me`
    )
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, accessTokenSecret);
    req.user = user;

    if (isAdminPaths && user.userGroupId !== 6) {
      return res.status(403).json({ error: 'You are not authorized to access this API' });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
