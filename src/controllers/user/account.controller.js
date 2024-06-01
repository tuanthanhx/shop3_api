const { ethers } = require('ethers');
const logger = require('../../utils/logger');
const { checkOtp, removeOtp } = require('../../utils/otp');
const db = require('../../models');

exports.connectWallet = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      address,
      signature,
      message,
    } = req.body;
    const signerAddress = ethers.verifyMessage(message, signature);

    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const duplicate = await db.user.findOne({
      where: { walletAddress: signerAddress },
    });

    if (duplicate) {
      res.status(400).json({ error: 'This wallet address is already used by other user' });
      return;
    }

    const me = await db.user.findByPk(userId);

    if (!me) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    me.update({
      walletAddress: signerAddress,
    });

    res.json({
      data: {
        message: 'Wallet connected successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.disconnectWallet = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const me = await db.user.findByPk(userId);

    if (!me) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!me.email && !me.phone) {
      res.status(400).json({ error: 'Cannot disconnect wallet if email and phone are empty' });
      return;
    }

    me.update({
      walletAddress: null,
    });

    res.json({
      data: {
        message: 'Wallet disconnected successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getOrdersStatistics = async (req, res) => {
  try {
    // TODO: Get real data later, now use dummy
    const data = {
      all: 1968,
      shipping: 968,
      completed: 1968,
      canceled: 68,
    };

    res.json({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      receiver,
      otp,
      password,
    } = req.body;

    const verifyOtpResult = await checkOtp(receiver, otp);
    if (!verifyOtpResult) {
      res.status(400).json({ data: 'Invalid OTP' });
      return;
    }
    await removeOtp(receiver);

    const me = await db.user.findByPk(userId);
    if (!me) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    if (me.email !== receiver && me.phone !== receiver) {
      res.status(404).send({
        message: 'This email or phone not belong to you',
      });
      return;
    }

    await me.update({
      password: me.generateHash(password),
    });

    res.json({
      data: {
        message: 'Password updated successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const data = await db.user_address.findAll({
      where: {
        userId,
      },
      attributes: ['id', 'firstName', 'lastName', 'phone', 'address', 'isDefault'],
      include: [
        {
          model: db.country,
          as: 'country',
          attributes: ['code', 'name'],
        },
      ],
    });
    res.json({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      firstName,
      lastName,
      phone,
      countryCode,
      address,
      isDefault,
    } = req.body;

    const object = {
      userId,
      firstName,
      lastName,
      phone,
      countryCode,
      address,
      isDefault,
    };

    const createdAddress = await db.user_address.create(object);

    if (isDefault) {
      await db.user_address.update(
        { isDefault: false },
        {
          where: {
            userId,
            id: { [db.Sequelize.Op.ne]: createdAddress.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Address created successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const { user } = req;
    const userId = user.id;

    const {
      firstName,
      lastName,
      phone,
      countryCode,
      address,
      isDefault,
    } = req.body;

    const userAddress = await db.user_address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!userAddress) {
      res.status(404).send({
        message: 'Address not found',
      });
      return;
    }

    const object = {
      firstName,
      lastName,
      phone,
      countryCode,
      address,
      isDefault,
    };

    await userAddress.update(object);

    if (isDefault) {
      await db.user_address.update(
        { isDefault: false },
        {
          where: {
            userId,
            id: { [db.Sequelize.Op.ne]: userAddress.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Address updated successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const { user } = req;
    const userId = user.id;

    const userAddress = await db.user_address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!userAddress) {
      res.status(404).send({
        message: 'Address not found',
      });
      return;
    }

    await userAddress.destroy();

    res.json({
      data: {
        message: 'Address deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getPaymentMethods = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const data = await db.payment_method.findAll({
      where: {
        userId,
      },
      // attributes: ['id', 'firstName', 'lastName', 'phone', 'address', 'isDefault'],
      // include: [
      //   {
      //     model: db.country,
      //     as: 'country',
      //     attributes: ['code', 'name'],
      //   },
      // ],
    });
    res.json({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createPaymentMethodWithCards = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      cardNumber,
      expYear,
      expMonth,
      ccv,
      isDefault,
    } = req.body;

    const object = {
      userId,
      cardNumber,
      expYear,
      expMonth,
      ccv,
      paymentMethodTypeId: 1,
      isActive: true,
      isDefault,
    };

    const createdData = await db.payment_method.create(object);
    await db.payment_method_card.create({
      paymentMethodId: createdData.id,
      cardNumber,
      expYear,
      expMonth,
      ccv,
    });

    if (isDefault) {
      await db.payment_method.update(
        { isDefault: false },
        {
          where: {
            userId,
            id: { [db.Sequelize.Op.ne]: createdData.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Payment method created successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createPaymentMethodWithPaypal = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      accountName,
      isDefault,
    } = req.body;

    const object = {
      userId,
      accountName,
      paymentMethodTypeId: 2,
      isActive: true,
      isDefault,
    };

    const createdData = await db.payment_method.create(object);
    await db.payment_method_paypal.create({
      paymentMethodId: createdData.id,
      accountName,
    });

    if (isDefault) {
      await db.payment_method.update(
        { isDefault: false },
        {
          where: {
            userId,
            id: { [db.Sequelize.Op.ne]: createdData.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Payment method created successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createPaymentMethodWithCryptocurrencies = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      walletAddress,
      isDefault,
    } = req.body;

    const object = {
      userId,
      walletAddress,
      paymentMethodTypeId: 3,
      isActive: true,
      isDefault,
    };

    const createdData = await db.payment_method.create(object);
    await db.payment_method_cryptocurrency.create({
      paymentMethodId: createdData.id,
      walletAddress,
    });

    if (isDefault) {
      await db.payment_method.update(
        { isDefault: false },
        {
          where: {
            userId,
            id: { [db.Sequelize.Op.ne]: createdData.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Payment method created successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createPaymentMethodWithOnline = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      serviceName,
      accountName,
      isDefault,
    } = req.body;

    const object = {
      userId,
      serviceName,
      accountName,
      paymentMethodTypeId: 4,
      isActive: true,
      isDefault,
    };

    const createdData = await db.payment_method.create(object);
    await db.payment_method_online.create({
      paymentMethodId: createdData.id,
      serviceName,
      accountName,
    });

    if (isDefault) {
      await db.payment_method.update(
        { isDefault: false },
        {
          where: {
            userId,
            id: { [db.Sequelize.Op.ne]: createdData.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Payment method created successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.setDefaultPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const { user } = req;
    const userId = user.id;

    const paymentMethod = await db.payment_method.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!paymentMethod) {
      res.status(404).send({
        message: 'Payment method not found',
      });
      return;
    }

    await paymentMethod.update({
      isDefault: true,
    });

    await db.payment_method.update(
      { isDefault: false },
      {
        where: {
          userId,
          id: { [db.Sequelize.Op.ne]: paymentMethod.id },
        },
      },
    );

    res.json({
      data: {
        message: 'Set payment method as default successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const { user } = req;
    const userId = user.id;

    const paymentMethod = await db.payment_method.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!paymentMethod) {
      res.status(404).send({
        message: 'Payment method not found',
      });
      return;
    }

    await paymentMethod.destroy();

    res.json({
      data: {
        message: 'Payment method deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getPaymentMethodTypes = async (req, res) => {
  try {
    const data = await db.payment_method_type.findAll({
      where: {
        isActive: true,
      },
      attributes: ['id', 'name'],
    });
    res.json({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
