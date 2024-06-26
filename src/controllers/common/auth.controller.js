const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const { Buffer } = require('buffer');
const { randomBytes } = require('tweetnacl');
const logger = require('../../utils/logger');
const { createOtp, checkOtp, removeOtp } = require('../../utils/otp');
const { sendEmail } = require('../../utils/email');
const { generateRandomNumber } = require('../../utils/utils');
const { createPayloadToken } = require('../../utils/jwt');
const { verifyTonProof } = require('../../utils/ton');
const db = require('../../models');

require('dotenv').config();

const User = db.user;
const UserRefreshToken = db.user_refresh_token;

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

exports.isLogin = async (req, res) => {
  if (req.user) {
    res.send({
      data: req.user,
    });
    return;
  }
  res.status(401).send({
    message: 'You are not logged in',
  });
};

exports.findMe = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await db.user.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.country,
          attributes: ['code', 'name'],
        },
        {
          model: db.language,
          attributes: ['id', 'name'],
        },
        {
          model: db.currency,
          attributes: ['id', 'name', 'code', 'symbol'],
        },
      ],
    });
    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }
    const userObject = user.toJSON();
    const shop = await db.shop.findOne({ where: { userId: id } });
    if (shop) {
      userObject.shopId = shop.id;
    }
    res.json({
      data: userObject,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.statistics = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await db.user.findByPk(id, {
      attributes: [
        'id',
        'uuid',
        [db.sequelize.literal('(SELECT COUNT(*) FROM products)'), 'reviewsCount'],
      ],
      include: [
        {
          model: db.shop,
          attributes: [
            'id',
            'shopName',
            [db.sequelize.literal('(SELECT COUNT(*) FROM products AS p WHERE p.shopId = shop.id)'), 'productsCount'],
          ],
        },
      ],
    });
    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }
    res.json({
      data: user,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.loginByEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email }, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).send({ error: 'Invalid email or password' });
      return;
    }

    const userIdentity = {
      id: user.id,
      uuid: user.uuid,
      userGroupId: user.userGroupId,
    };
    const accessToken = jwt.sign(userIdentity, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign(userIdentity, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

    const findToken = await UserRefreshToken.findOne({ where: { userId: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, userId: user.id });
    }

    res.json({
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.loginByPhone = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ where: { phone }, attributes: { include: ['password'] } });
    if (!user || !user.validPassword(password)) {
      res.status(401).send({ error: 'Invalid phone or password' });
      return;
    }

    const userIdentity = {
      id: user.id,
      uuid: user.uuid,
      userGroupId: user.userGroupId,
    };
    const accessToken = jwt.sign(userIdentity, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign(userIdentity, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

    const findToken = await UserRefreshToken.findOne({ where: { userId: user.id } });
    if (findToken) {
      findToken.update({ token: refreshToken });
    } else {
      await UserRefreshToken.create({ token: refreshToken, userId: user.id });
    }

    res.json({
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.loginByWallet = async (req, res) => {
  try {
    const {
      address,
      signature,
      message,
      userGroupId,
    } = req.body;
    const signerAddress = ethers.verifyMessage(message, signature);

    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const tmpPassword = generateRandomNumber(6);

    const [user, createdUser] = await db.user.findOrCreate({
      where: { walletAddress: address },
      defaults: {
        password: tmpPassword,
        userGroupId: userGroupId || 1,
      },
    });

    const userData = user || createdUser;

    const userIdentity = {
      id: userData.id,
      uuid: userData.uuid,
      userGroupId: userData.userGroupId,
    };
    const accessToken = jwt.sign(userIdentity, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign(userIdentity, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

    const [token, createdToken] = await UserRefreshToken.findOrCreate({
      where: { userId: userData.id },
      defaults: { token: refreshToken },
    });

    if (!createdToken) {
      await token.update({ token: refreshToken });
    }

    res.json({
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.generateTonPayload = async (req, res) => {
  try {
    const payload = Buffer.from(randomBytes(32)).toString('hex');
    const payloadToken = await createPayloadToken({ payload });
    res.json({
      payload: payloadToken,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      message: error.message || 'Some error occurred',
    });
  }
};

exports.loginByTonWallet = async (req, res) => {
  try {
    const { payload, userGroupId } = req.body;

    const isValid = await verifyTonProof(payload);

    if (!isValid) {
      res.status(401).send({
        message: 'Invalid proof',
      });
      return;
    }

    // const payloadToken = body.proof.payload;
    // if (!await verifyToken(payloadToken)) {
    //   res.status(401).send({
    //     message: 'Invalid token',
    //   });
    //   return;
    // }

    // const accessToken = await createAuthToken({ address: body.address, network: body.network });

    const { address } = payload;
    const tmpPassword = generateRandomNumber(6);

    const [user, createdUser] = await db.user.findOrCreate({
      where: { walletAddress: address },
      defaults: {
        password: tmpPassword,
        userGroupId: userGroupId || 1,
      },
    });

    const userData = user || createdUser;

    const userIdentity = {
      id: userData.id,
      uuid: userData.uuid,
      userGroupId: userData.userGroupId,
    };
    const accessToken = jwt.sign(userIdentity, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
    const refreshToken = jwt.sign(userIdentity, refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' });

    const [token, createdToken] = await UserRefreshToken.findOrCreate({
      where: { userId: userData.id },
      defaults: { token: refreshToken },
    });

    if (!createdToken) {
      await token.update({ token: refreshToken });
    }

    res.json({
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      message: error.message || 'Some error occurred',
    });
  }
};

exports.logout = async (req, res) => {
  if (req.user?.id) {
    await UserRefreshToken.destroy({ where: { userId: req.user.id } });
  }
  res.status(204).end();
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).send({ error: 'Refresh token is invalid' });
    return;
  }

  try {
    const findRefreshToken = await UserRefreshToken.findOne({ where: { token: refreshToken } });
    if (!findRefreshToken) {
      res.status(401).send({ error: 'Refresh token is invalid' });
      return;
    }

    // Handle remove expired token (below is example code)
    // if (verifyExpiration(refreshToken)) {
    //   db.authToken.destroy({ where: { id: refreshToken.id } });
    //   res.status(403).send("Refresh token was expired. Please make a new sign in request");
    //   return;
    // }

    // authToken.createToken = async function (user) {
    //   let expiredAt = new Date();
    //   expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);
    //   let _token = uuidv4();
    //   let refreshToken = await authToken.create({
    //     token: _token,
    //     user: user.id,
    //     expiryDate: expiredAt.getTime(),
    //   });
    //   return refreshToken.token;
    // };

    // authToken.verifyExpiration = (token) => {
    //   return token.expiryDate.getTime() < new Date().getTime();
    // };

    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token is invalid' });
      }
      const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
      return res.json({
        data: { accessToken },
      });
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Refresh token is invalid' });
  }
};

exports.generateOtpByEmail = async (req, res) => {
  const { email } = req.body;
  const code = await createOtp(email);
  if (!code) {
    res.status(500).json({ data: 'Cannot generate a verification code' });
    return;
  }
  sendEmail(email, 'Verification Code', `Your verification code is: ${code}`);
  res.send({ data: true });
};

exports.generateOtpByPhone = async (req, res) => {
  const { phone } = req.body;
  const code = await createOtp(phone);
  if (!code) {
    res.status(500).json({ data: 'Cannot generate a verification code' });
    return;
  }
  // TODO: Make SMS feature later
  // sendSms(phone, 'Verification Code', `Your verification code is: ${code}`);
  res.send({ data: true });
};

exports.confirmOtp = async (req, res) => {
  try {
    const { receiver, code, remove } = req.body;
    const verifyOtpResult = await checkOtp(receiver, code);
    if (!verifyOtpResult) {
      res.status(400).json({ data: 'Invalid verification code' });
      return;
    }
    if (remove) {
      await removeOtp(receiver);
    }
    res.send({ data: true });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.resetPasswordByEmail = async (req, res) => {
  try {
    const {
      email,
      password,
      verificationCode,
    } = req.body;

    const verifyOtpResult = await checkOtp(email, verificationCode);
    if (!verifyOtpResult) {
      res.status(400).json({ data: 'Invalid verification code' });
      return;
    }
    await removeOtp(email);

    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      res.status(404).send({
        message: 'Cannot find an account with the provided email',
      });
      return;
    }

    await foundUser.update({
      password: foundUser.generateHash(password),
    });

    res.send({
      data: true,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.resetPasswordByPhone = async (req, res) => {
  try {
    const {
      phone,
      password,
      verificationCode,
    } = req.body;

    const verifyOtpResult = await checkOtp(phone, verificationCode);
    if (!verifyOtpResult) {
      res.status(400).json({ data: 'Invalid verification code' });
      return;
    }
    await removeOtp(phone);

    const foundUser = await User.findOne({ where: { phone } });
    if (!foundUser) {
      res.status(404).send({
        message: 'Cannot find an account with the provided phone',
      });
      return;
    }

    await foundUser.update({
      password: foundUser.generateHash(password),
    });

    res.send({
      data: true,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
