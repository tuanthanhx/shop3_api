const { ethers } = require('ethers');
const { verifyTonProof } = require('../../utils/ton');
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

exports.connectTonWallet = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      payload,
    } = req.body;

    const isValid = await verifyTonProof(payload);

    if (!isValid) {
      res.status(401).send({
        message: 'Invalid proof',
      });
      return;
    }

    const { address } = payload;

    const duplicate = await db.user.findOne({
      where: { walletAddress: address },
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
      walletAddress: address,
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

exports.updateProfile = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      email,
      emailOtp,
      phone,
      phoneOtp,
      dob,
      name,
      avatar,
      gender,
      countryCode,
      languageId,
      currencyId,
      subscribeMailingList,
    } = req.body;

    const me = await db.user.findByPk(userId);
    if (!me) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    const object = {};

    if (email && emailOtp) {
      if (me.email === email) {
        res.status(400).send({
          message: 'New email cannot be the same as the current email',
        });
        return;
      }

      const duplicate = await db.user.findOne({
        where: {
          email,
          id: { [db.Sequelize.Op.ne]: userId },
        },
      });

      if (duplicate) {
        res.status(409).send({
          message: 'Email already in use by another user',
        });
        return;
      }

      const verifyEmailOtp = await checkOtp(email, emailOtp);
      if (!verifyEmailOtp) {
        res.status(400).json({ data: 'Invalid Email OTP' });
        return;
      }

      object.email = email;
    }

    if (phone && phoneOtp) {
      if (me.phone === phone) {
        res.status(400).send({
          message: 'New phone number cannot be the same as the current phone',
        });
        return;
      }

      const duplicate = await db.user.findOne({
        where: {
          phone,
          id: { [db.Sequelize.Op.ne]: userId },
        },
      });

      if (duplicate) {
        res.status(409).send({
          message: 'Phone number already in use by another user',
        });
        return;
      }

      const verifyPhoneOtp = await checkOtp(phone, phoneOtp);
      if (!verifyPhoneOtp) {
        res.status(400).json({ data: 'Invalid Phone OTP' });
        return;
      }

      object.phone = phone;
    }

    if (name !== undefined) {
      object.name = name;
    }

    if (avatar !== undefined) {
      object.avatar = avatar;
    }

    if (gender) {
      object.gender = gender;
    }

    if (dob) {
      object.dob = dob;
    }

    if (countryCode) {
      const country = await db.country.findOne({
        where: {
          code: countryCode,
        },
      });

      if (!country) {
        res.status(404).send({
          message: 'Country not found',
        });
        return;
      }
      object.countryCode = countryCode;
    }

    if (languageId) {
      const language = await db.language.findOne({
        where: {
          id: languageId,
        },
      });

      if (!language) {
        res.status(404).send({
          message: 'Language not found',
        });
        return;
      }
      object.languageId = languageId;
    }

    if (currencyId) {
      const currency = await db.currency.findOne({
        where: {
          id: currencyId,
        },
      });

      if (!currency) {
        res.status(404).send({
          message: 'Currency not found',
        });
        return;
      }
      object.currencyId = currencyId;
    }

    if (subscribeMailingList !== undefined) {
      object.subscribeMailingList = subscribeMailingList;
    }

    await me.update(object);

    if (email) {
      await removeOtp(email);
    }

    if (phone) {
      await removeOtp(phone);
    }

    res.json({
      data: {
        message: 'Profile updated successfully',
      },
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

    const paymentMethods = await db.payment_method.findAll({
      where: {
        userId,
      },
      attributes: ['id', 'paymentMethodTypeId', 'isDefault'],
      include: [
        {
          model: db.payment_method_type,
          attributes: ['name'],
        },
      ],
    });

    const result = await Promise.all(paymentMethods.map(async (paymentMethod) => {
      let specificAssociation = null;

      switch (paymentMethod.paymentMethodTypeId) {
        case 1:
          specificAssociation = await paymentMethod.getPayment_method_card({
            attributes: ['cardName', 'cardNumber'],
          });
          break;
        case 2:
          specificAssociation = await paymentMethod.getPayment_method_paypal({
            attributes: ['accountName'],
          });
          break;
        case 3:
          specificAssociation = await paymentMethod.getPayment_method_cryptocurrency({
            attributes: ['walletAddress'],
          });
          break;
        case 4:
          specificAssociation = await paymentMethod.getPayment_method_online({
            attributes: ['serviceName', 'accountName'],
          });
          break;
        default:
          break;
      }

      return {
        id: paymentMethod.id,
        paymentMethodTypeId: paymentMethod.paymentMethodTypeId,
        paymentMethodType: paymentMethod.payment_method_type?.name,
        isDefault: paymentMethod.isDefault,
        info: specificAssociation ? specificAssociation.toJSON() : null,
      };
    }));

    const groupedResult = result.reduce((acc, paymentMethod) => {
      const { paymentMethodTypeId } = paymentMethod;
      if (!acc[paymentMethodTypeId]) {
        acc[paymentMethodTypeId] = {
          typeId: paymentMethod.paymentMethodTypeId,
          typeName: paymentMethod.paymentMethodType,
          items: [],
        };
      }
      acc[paymentMethodTypeId].items.push({
        id: paymentMethod.id,
        isDefault: paymentMethod.isDefault,
        info: paymentMethod.info,
      });
      return acc;
    }, {});

    res.json({
      data: Object.values(groupedResult),
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
      cardName,
      cardNumber,
      expYear,
      expMonth,
      ccv,
      isDefault,
    } = req.body;

    const object = {
      userId,
      paymentMethodTypeId: 1,
      isActive: true,
      isDefault,
    };

    const createdData = await db.payment_method.create(object);
    await db.payment_method_card.create({
      paymentMethodId: createdData.id,
      cardName,
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
