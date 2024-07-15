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
    '/api-common',
    `/api-user/${apiVersion}/nowpayments/ipn_callback`,
    `/api-user/${apiVersion}/coingate/ipn_callback`,
    `/api-user/${apiVersion}/blockonomics/ipn_callback`,
    `/api-user/${apiVersion}/crypto/ipn_callback`,
  ];
  const adminPaths = [
    '/api-admin',
  ];
  // const externalPaths = [
  //   '/api-external',
  // ];
  const sellerPaths = [
    '/api-seller',
  ];
  const userPaths = [
    '/api-user',
  ];
  const isPublicPaths = publicPaths.some((path) => req.path.startsWith(path));
  const isAdminPaths = adminPaths.some((path) => req.path.startsWith(path));
  // const isExternalPaths = externalPaths.some((path) => req.path.startsWith(path));
  const isSellerPaths = sellerPaths.some((path) => req.path.startsWith(path));
  const isUserPaths = userPaths.some((path) => req.path.startsWith(path));

  if (
    req.path === '/' || (
      isPublicPaths
      && req.path !== `/api-common/${apiVersion}/auth/is_login`
      && req.path !== `/api-common/${apiVersion}/auth/me`
      && req.path !== `/api-common/${apiVersion}/auth/statistics`
      && req.path !== `/api-common/${apiVersion}/auth/login_history`
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

    // if (isExternalPaths && user.userGroupId !== 5) {
    //   return res.status(403).json({ error: 'You are not authorized to access this API' });
    // }

    if (isSellerPaths && user.userGroupId !== 2) {
      return res.status(403).json({ error: 'You are not authorized to access this API' });
    }

    if (isUserPaths && user.userGroupId !== 1) {
      return res.status(403).json({ error: 'You are not authorized to access this API' });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
