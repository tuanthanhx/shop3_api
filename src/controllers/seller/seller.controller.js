const logger = require('../../utils/logger');
const { checkOtp, removeOtp } = require('../../utils/otp');
const s3 = require('../../utils/s3');
const db = require('../../models');

exports.getBusinessTypes = async (req, res) => {
  try {
    const data = await db.seller_business_type.findAll();
    res.send({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getVerification = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const shop = await db.shop.findOne({ where: { userId } });
    if (!shop) {
      res.status(404).send({
        message: 'Cannot find data with the current user',
      });
      return;
    }

    res.send({
      data: shop,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createVerification = async (req, res) => {
  try {
    const {
      businessType,
      shopName,
      householdBusinessName,
      householdBusinessRegistrationNumber,
      householdBusinessOwnerName,
      householdBusinessOwnerIdNumber,
      individualIdentityCardNumber,
      individualBusinessOwnerName,
      individualOwnerDob,
      individualResidentialAddress,
      individualProductCategoryId,
      corporateCompanyName,
      corporateEnterpriseCodeNumber,
      subscribeMailingList,
      useCurrentEmail,
      newEmail,
      newEmailOtp,
      useCurrentPhone,
      newPhone,
      newPhoneOtp,
      isSubmitted,
    } = req.body;

    const { id: userId } = req.user;

    const foundUser = await db.user.findByPk(userId);
    if (!foundUser) {
      res.status(400).send({
        message: 'Cannot find data with the current user',
      });
      return;
    }

    const shop = await db.shop.findOne({ where: { userId } });
    if (shop) {
      res.status(400).send({
        message: 'This user has a shop already, cannot create more.',
      });
      return;
    }

    const foundBusinessType = await db.seller_business_type.findOne({
      where: { id: businessType },
    });
    if (!foundBusinessType) {
      res.status(400).send({
        message: 'The provided businessType is invalid',
      });
      return;
    }

    const object = {
      sellerBusinessTypeId: businessType,
      shopName,
      userId,
      subscribeMailingList,
      isSubmitted,
    };

    if (useCurrentEmail) {
      object.email = foundUser.email;
    } else if (newEmail) {
      const verifyOtpResult = await checkOtp(newEmail, newEmailOtp);
      if (!verifyOtpResult) {
        res.status(400).json({ data: 'Invalid verification code for the new email' });
        return;
      }
      object.email = newEmail;
    } else {
      res.status(400).json({ data: 'No email provided' });
      return;
    }

    if (useCurrentPhone) {
      object.phone = foundUser.phone;
    } else if (newPhone) {
      const verifyOtpResult = await checkOtp(newPhone, newPhoneOtp);
      if (!verifyOtpResult) {
        res.status(400).json({ data: 'Invalid verification code for the new phone' });
        return;
      }
      object.phone = newPhone;
    } else {
      res.status(400).json({ data: 'No phone provided' });
      return;
    }

    if (isSubmitted) {
      object.isSubmitted = true;
    } else {
      object.isSubmitted = false;
    }

    // Append new shop data
    if (businessType === 1) { // Household
      const { householdBusinessRegistrationDocument1, householdBusinessRegistrationDocument2, householdBusinessRegistrationDocument3 } = req.files;
      if (householdBusinessRegistrationDocument1?.length) {
        const uploadedHouseholdBusinessRegistrationDocument1 = await s3.upload(householdBusinessRegistrationDocument1, 'private24/seller/verification');
        [object.householdBusinessRegistrationDocument1] = uploadedHouseholdBusinessRegistrationDocument1;
      }
      if (householdBusinessRegistrationDocument2?.length) {
        const uploadedHouseholdBusinessRegistrationDocument2 = await s3.upload(householdBusinessRegistrationDocument2, 'private24/seller/verification');
        [object.householdBusinessRegistrationDocument2] = uploadedHouseholdBusinessRegistrationDocument2;
      }
      if (householdBusinessRegistrationDocument3?.length) {
        const uploadedHouseholdBusinessRegistrationDocument3 = await s3.upload(householdBusinessRegistrationDocument3, 'private24/seller/verification');
        [object.householdBusinessRegistrationDocument3] = uploadedHouseholdBusinessRegistrationDocument3;
      }
      object.householdBusinessName = householdBusinessName;
      object.householdBusinessRegistrationNumber = householdBusinessRegistrationNumber;
      object.householdBusinessOwnerName = householdBusinessOwnerName;
      object.householdBusinessOwnerIdNumber = householdBusinessOwnerIdNumber;
    } else if (businessType === 2) { // Individual
      const { individualIdentityCardFront, individualIdentityCardBack } = req.files;
      if (individualIdentityCardFront?.length) {
        const uploadedIndividualIdentityCardFront = await s3.upload(individualIdentityCardFront, 'private24/seller/verification');
        [object.individualIdentityCardFront] = uploadedIndividualIdentityCardFront;
      }
      if (individualIdentityCardBack?.length) {
        const uploadedIndividualIdentityCardBack = await s3.upload(individualIdentityCardBack, 'private24/seller/verification');
        [object.individualIdentityCardBack] = uploadedIndividualIdentityCardBack;
      }
      object.individualIdentityCardNumber = individualIdentityCardNumber;
      object.individualBusinessOwnerName = individualBusinessOwnerName;
      object.individualOwnerDob = individualOwnerDob;
      object.individualResidentialAddress = individualResidentialAddress;
      object.individualProductCategoryId = individualProductCategoryId;
    } else if (businessType === 3) { // Corporate
      const { corporateCompanyRegistrationDocument1, corporateCompanyRegistrationDocument2, corporateCompanyRegistrationDocument3 } = req.files;
      if (corporateCompanyRegistrationDocument1?.length) {
        const uploadedCorporateCompanyRegistrationDocument1 = await s3.upload(corporateCompanyRegistrationDocument1, 'private24/seller/verification');
        [object.corporateCompanyRegistrationDocument1] = uploadedCorporateCompanyRegistrationDocument1;
      }
      if (corporateCompanyRegistrationDocument2?.length) {
        const uploadedCorporateCompanyRegistrationDocument2 = await s3.upload(corporateCompanyRegistrationDocument2, 'private24/seller/verification');
        [object.corporateCompanyRegistrationDocument2] = uploadedCorporateCompanyRegistrationDocument2;
      }
      if (corporateCompanyRegistrationDocument3?.length) {
        const uploadedCorporateCompanyRegistrationDocument3 = await s3.upload(corporateCompanyRegistrationDocument3, 'private24/seller/verification');
        [object.corporateCompanyRegistrationDocument3] = uploadedCorporateCompanyRegistrationDocument3;
      }
      object.corporateCompanyName = corporateCompanyName;
      object.corporateEnterpriseCodeNumber = corporateEnterpriseCodeNumber;
    }

    const createdShop = await db.shop.create(object);

    if (object.newEmail) await removeOtp(newEmail);
    if (object.newPhone) await removeOtp(newPhone);

    res.send({
      data: createdShop,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.updateVerification = async (req, res) => {
  try {
    const {
      businessType,
      shopName,
      householdBusinessName,
      householdBusinessRegistrationNumber,
      householdBusinessOwnerName,
      householdBusinessOwnerIdNumber,
      individualIdentityCardNumber,
      individualBusinessOwnerName,
      individualOwnerDob,
      individualResidentialAddress,
      individualProductCategoryId,
      corporateCompanyName,
      corporateEnterpriseCodeNumber,
      removeHouseholdBusinessRegistrationDocument1,
      removeHouseholdBusinessRegistrationDocument2,
      removeHouseholdBusinessRegistrationDocument3,
      removeIndividualIdentityCardFront,
      removeIndividualIdentityCardBack,
      removeCorporateCompanyRegistrationDocument1,
      removeCorporateCompanyRegistrationDocument2,
      removeCorporateCompanyRegistrationDocument3,
      subscribeMailingList,
      newEmail,
      newEmailOtp,
      newPhone,
      newPhoneOtp,
      isSubmitted,
    } = req.body;

    const { id: userId } = req.user;

    const foundUser = await db.user.findByPk(userId);
    if (!foundUser) {
      res.status(400).send({
        message: 'Cannot find data with the current user',
      });
      return;
    }

    const shop = await db.shop.findOne({ where: { userId } });
    if (!shop) {
      res.status(400).send({
        message: 'Cannot find shop with the current user',
      });
      return;
    }

    const foundBusinessType = await db.seller_business_type.findOne({
      where: { id: businessType },
    });
    if (!foundBusinessType) {
      res.status(400).send({
        message: 'The provided businessType is invalid',
      });
      return;
    }

    const object = {};
    if (businessType) object.sellerBusinessTypeId = businessType;
    if (shopName) object.shopName = shopName;
    if (subscribeMailingList) object.subscribeMailingList = subscribeMailingList;
    if (isSubmitted) object.isSubmitted = isSubmitted;

    if (newEmail) {
      const verifyOtpResult = await checkOtp(newEmail, newEmailOtp);
      if (!verifyOtpResult) {
        res.status(400).json({ data: 'Invalid verification code for the new email' });
        return;
      }
      object.email = newEmail;
    }

    if (newPhone) {
      const verifyOtpResult = await checkOtp(newPhone, newPhoneOtp);
      if (!verifyOtpResult) {
        res.status(400).json({ data: 'Invalid verification code for the new phone' });
        return;
      }
      object.phone = newPhone;
    }

    if (isSubmitted) object.isSubmitted = isSubmitted;

    // Reset current shop data
    if (businessType !== 1) { // Household
      object.householdBusinessRegistrationDocument1 = null;
      object.householdBusinessRegistrationDocument2 = null;
      object.householdBusinessRegistrationDocument3 = null;
      object.householdBusinessName = null;
      object.householdBusinessRegistrationNumber = null;
      object.householdBusinessOwnerName = null;
      object.householdBusinessOwnerIdNumber = null;
    }

    if (businessType !== 2) { // Individual
      object.individualIdentityCardFront = null;
      object.individualIdentityCardBack = null;
      object.individualIdentityCardNumber = null;
      object.individualBusinessOwnerName = null;
      object.individualOwnerDob = null;
      object.individualResidentialAddress = null;
      object.individualProductCategoryId = null;
    }

    if (businessType !== 3) { // Corporate
      object.corporateCompanyRegistrationDocument1 = null;
      object.corporateCompanyRegistrationDocument2 = null;
      object.corporateCompanyRegistrationDocument3 = null;
      object.corporateCompanyName = null;
      object.corporateEnterpriseCodeNumber = null;
    }

    // Append new shop data
    if (businessType === 1) { // Household
      // Remove current docs
      if (removeHouseholdBusinessRegistrationDocument1) object.householdBusinessRegistrationDocument1 = null;
      if (removeHouseholdBusinessRegistrationDocument2) object.householdBusinessRegistrationDocument2 = null;
      if (removeHouseholdBusinessRegistrationDocument3) object.householdBusinessRegistrationDocument3 = null;

      const { householdBusinessRegistrationDocument1, householdBusinessRegistrationDocument2, householdBusinessRegistrationDocument3 } = req.files;
      if (householdBusinessRegistrationDocument1?.length) {
        const uploadedHouseholdBusinessRegistrationDocument1 = await s3.upload(householdBusinessRegistrationDocument1, 'private24/seller/verification');
        [object.householdBusinessRegistrationDocument1] = uploadedHouseholdBusinessRegistrationDocument1;
      }
      if (householdBusinessRegistrationDocument2?.length) {
        const uploadedHouseholdBusinessRegistrationDocument2 = await s3.upload(householdBusinessRegistrationDocument2, 'private24/seller/verification');
        [object.householdBusinessRegistrationDocument2] = uploadedHouseholdBusinessRegistrationDocument2;
      }
      if (householdBusinessRegistrationDocument3?.length) {
        const uploadedHouseholdBusinessRegistrationDocument3 = await s3.upload(householdBusinessRegistrationDocument3, 'private24/seller/verification');
        [object.householdBusinessRegistrationDocument3] = uploadedHouseholdBusinessRegistrationDocument3;
      }
      if (householdBusinessName) object.householdBusinessName = householdBusinessName;
      if (householdBusinessRegistrationNumber) object.householdBusinessRegistrationNumber = householdBusinessRegistrationNumber;
      if (householdBusinessOwnerName) object.householdBusinessOwnerName = householdBusinessOwnerName;
      if (householdBusinessOwnerIdNumber) object.householdBusinessOwnerIdNumber = householdBusinessOwnerIdNumber;
    } else if (businessType === 2) { // Individual
      // Remove current docs
      if (removeIndividualIdentityCardFront) object.individualIdentityCardFront = null;
      if (removeIndividualIdentityCardBack) object.individualIdentityCardBack = null;

      const { individualIdentityCardFront, individualIdentityCardBack } = req.files;
      if (individualIdentityCardFront?.length) {
        const uploadedIndividualIdentityCardFront = await s3.upload(individualIdentityCardFront, 'private24/seller/verification');
        [object.individualIdentityCardFront] = uploadedIndividualIdentityCardFront;
      }
      if (individualIdentityCardBack?.length) {
        const uploadedIndividualIdentityCardBack = await s3.upload(individualIdentityCardBack, 'private24/seller/verification');
        [object.individualIdentityCardBack] = uploadedIndividualIdentityCardBack;
      }
      if (individualIdentityCardNumber) object.individualIdentityCardNumber = individualIdentityCardNumber;
      if (individualBusinessOwnerName) object.individualBusinessOwnerName = individualBusinessOwnerName;
      if (individualOwnerDob) object.individualOwnerDob = individualOwnerDob;
      if (individualResidentialAddress) object.individualResidentialAddress = individualResidentialAddress;
      if (individualProductCategoryId) object.individualProductCategoryId = individualProductCategoryId;
    } else if (businessType === 3) { // Corporate
      // Remove current docs
      if (removeCorporateCompanyRegistrationDocument1) object.corporateCompanyRegistrationDocument1 = null;
      if (removeCorporateCompanyRegistrationDocument2) object.corporateCompanyRegistrationDocument2 = null;
      if (removeCorporateCompanyRegistrationDocument3) object.corporateCompanyRegistrationDocument3 = null;

      const { corporateCompanyRegistrationDocument1, corporateCompanyRegistrationDocument2, corporateCompanyRegistrationDocument3 } = req.files;
      if (corporateCompanyRegistrationDocument1?.length) {
        const uploadedCorporateCompanyRegistrationDocument1 = await s3.upload(corporateCompanyRegistrationDocument1, 'private24/seller/verification');
        [object.corporateCompanyRegistrationDocument1] = uploadedCorporateCompanyRegistrationDocument1;
      }
      if (corporateCompanyRegistrationDocument2?.length) {
        const uploadedCorporateCompanyRegistrationDocument2 = await s3.upload(corporateCompanyRegistrationDocument2, 'private24/seller/verification');
        [object.corporateCompanyRegistrationDocument2] = uploadedCorporateCompanyRegistrationDocument2;
      }
      if (corporateCompanyRegistrationDocument3?.length) {
        const uploadedCorporateCompanyRegistrationDocument3 = await s3.upload(corporateCompanyRegistrationDocument3, 'private24/seller/verification');
        [object.corporateCompanyRegistrationDocument3] = uploadedCorporateCompanyRegistrationDocument3;
      }
      if (corporateCompanyName) object.corporateCompanyName = corporateCompanyName;
      if (corporateEnterpriseCodeNumber) object.corporateEnterpriseCodeNumber = corporateEnterpriseCodeNumber;
    }

    await shop.update(object);

    if (object.newEmail) await removeOtp(newEmail);
    if (object.newPhone) await removeOtp(newPhone);

    res.send({
      data: shop,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getLogisticsServices = async (req, res) => {
  try {
    const { user } = req;

    const logisticsServices = await db.logistics_service.findAll({
      where: { isEnabled: true },
      attributes: ['id', 'name', 'description'],
      include: [
        {
          model: db.logistics_provider,
          as: 'logisticsProviders',
          attributes: ['id', 'name', 'description', 'logo'],
          where: { isEnabled: true },
          through: {
            attributes: [],
          },
          include: [
            {
              model: db.logistics_provider_option,
              as: 'logisticsProvidersOptions',
              attributes: ['packageWeightMin', 'packageWeightMax', 'packageWidthMax', 'packageHeightMax', 'packageLengthMax', 'codSupported', 'cpSupported'],
              where: {
                logisticsServiceId: { [db.Sequelize.Op.col]: 'logistics_service.id' },
              },
            },
          ],
        },
      ],
    });

    const shop = await db.shop.findOne({
      where: { userId: user.id },
      attributes: [],
      include: [
        {
          model: db.logistics_service,
          as: 'logisticsServices',
          where: { isEnabled: true },
          attributes: ['id', 'uniqueId', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    let updatedLogisticsServices;
    if (shop && shop?.logisticsServices?.length && logisticsServices?.length) {
      updatedLogisticsServices = logisticsServices.map((el) => el.get({ plain: true })).map((service) => {
        const isSubscribed = shop.logisticsServices.some((shopService) => shopService.id === service.id);
        return {
          ...service,
          isSubscribed,
        };
      });
    } else {
      updatedLogisticsServices = logisticsServices;
    }

    res.send({
      data: updatedLogisticsServices,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.subscribeLogisticsServices = async (req, res) => {
  try {
    const { user } = req;

    const { serviceId } = req.body;

    const shop = await db.shop.findOne({
      where: { userId: user.id },
    });

    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const logisticsService = await db.logistics_service.findByPk(serviceId);

    if (!logisticsService) {
      res.status(404).send({
        message: 'Logistics service not found',
      });
      return;
    }

    await shop.addLogisticsService(logisticsService);

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

exports.unsubscribeLogisticsServices = async (req, res) => {
  try {
    const { user } = req;

    const { serviceId } = req.body;

    const shop = await db.shop.findOne({
      where: { userId: user.id },
    });

    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const logisticsService = await db.logistics_service.findByPk(serviceId);

    if (!logisticsService) {
      res.status(404).send({
        message: 'Logistics service not found',
      });
      return;
    }

    await shop.removeLogisticsService(logisticsService);

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

exports.estimateShippingFee = async (req, res) => {
  const baseFee = (serviceId) => {
    if (serviceId === 1) {
      return 10000;
    }
    return 15000;
  };

  const weightFee = (weight) => weight * 10000;

  const calculateShippingFee = (serviceId, weight, width, height, length) => {
    const volumetricWeight = (length * width * height) / 6000;
    const finalWeight = Math.max(weight / 1000, volumetricWeight);
    let fee = baseFee(serviceId);
    fee += weightFee(finalWeight);
    return fee;
  };

  try {
    const {
      serviceId,
      weight,
      width,
      height,
      length,
    } = req.body;
    const fee = calculateShippingFee(serviceId, weight, width, height, length);
    res.json({ estimatedShippingFee: fee });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
