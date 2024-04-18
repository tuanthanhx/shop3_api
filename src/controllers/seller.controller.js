const { checkOtp, removeOtp } = require('../utils/otp');
const gcs = require('../utils/gcs');
const db = require('../models');

exports.getBusinessTypes = async (req, res) => {
  try {
    const data = await db.seller_business_type.findAll();
    res.send({
      data,
    });
  } catch (err) {
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

    // Reset current shop data
    object.householdBusinessRegistrationDocument1 = null;
    object.householdBusinessRegistrationDocument2 = null;
    object.householdBusinessRegistrationDocument3 = null;
    object.householdBusinessName = null;
    object.householdBusinessRegistrationNumber = null;
    object.householdBusinessOwnerName = null;
    object.householdBusinessOwnerIdNumber = null;
    object.individualIdentityCardFront = null;
    object.individualIdentityCardBack = null;
    object.individualIdentityCardNumber = null;
    object.individualBusinessOwnerName = null;
    object.individualOwnerDob = null;
    object.individualResidentialAddress = null;
    object.individualProductCategoryId = null;
    object.corporateCompanyRegistrationDocument1 = null;
    object.corporateCompanyRegistrationDocument2 = null;
    object.corporateCompanyRegistrationDocument3 = null;
    object.corporateCompanyName = null;
    object.corporateEnterpriseCodeNumber = null;

    // Append new shop data
    if (businessType === 1) { // Household
      const { householdBusinessRegistrationDocument1, householdBusinessRegistrationDocument2, householdBusinessRegistrationDocument3 } = req.files;
      if (householdBusinessRegistrationDocument1?.length) {
        const uploadedHouseholdBusinessRegistrationDocument1 = await gcs.upload(householdBusinessRegistrationDocument1, 'private/seller/verification');
        [object.householdBusinessRegistrationDocument1] = uploadedHouseholdBusinessRegistrationDocument1;
      }
      if (householdBusinessRegistrationDocument2?.length) {
        const uploadedHouseholdBusinessRegistrationDocument2 = await gcs.upload(householdBusinessRegistrationDocument2, 'private/seller/verification');
        [object.householdBusinessRegistrationDocument2] = uploadedHouseholdBusinessRegistrationDocument2;
      }
      if (householdBusinessRegistrationDocument3?.length) {
        const uploadedHouseholdBusinessRegistrationDocument3 = await gcs.upload(householdBusinessRegistrationDocument3, 'private/seller/verification');
        [object.householdBusinessRegistrationDocument3] = uploadedHouseholdBusinessRegistrationDocument3;
      }
      object.householdBusinessName = householdBusinessName;
      object.householdBusinessRegistrationNumber = householdBusinessRegistrationNumber;
      object.householdBusinessOwnerName = householdBusinessOwnerName;
      object.householdBusinessOwnerIdNumber = householdBusinessOwnerIdNumber;
    } else if (businessType === 2) { // Individual
      const { individualIdentityCardFront, individualIdentityCardBack } = req.files;
      if (individualIdentityCardFront?.length) {
        const uploadedIndividualIdentityCardFront = await gcs.upload(individualIdentityCardFront, 'private/seller/verification');
        [object.individualIdentityCardFront] = uploadedIndividualIdentityCardFront;
      }
      if (individualIdentityCardBack?.length) {
        const uploadedIndividualIdentityCardBack = await gcs.upload(individualIdentityCardBack, 'private/seller/verification');
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
        const uploadedCorporateCompanyRegistrationDocument1 = await gcs.upload(corporateCompanyRegistrationDocument1, 'private/seller/verification');
        [object.corporateCompanyRegistrationDocument1] = uploadedCorporateCompanyRegistrationDocument1;
      }
      if (corporateCompanyRegistrationDocument2?.length) {
        const uploadedCorporateCompanyRegistrationDocument2 = await gcs.upload(corporateCompanyRegistrationDocument2, 'private/seller/verification');
        [object.corporateCompanyRegistrationDocument2] = uploadedCorporateCompanyRegistrationDocument2;
      }
      if (corporateCompanyRegistrationDocument3?.length) {
        const uploadedCorporateCompanyRegistrationDocument3 = await gcs.upload(corporateCompanyRegistrationDocument3, 'private/seller/verification');
        [object.corporateCompanyRegistrationDocument3] = uploadedCorporateCompanyRegistrationDocument3;
      }
      object.corporateCompanyName = corporateCompanyName;
      object.corporateEnterpriseCodeNumber = corporateEnterpriseCodeNumber;
    }

    let shop = await db.shop.findOne({ where: { userId } });

    if (shop) {
      shop = await shop.update(object);
    } else {
      shop = await db.shop.create(object);
    }

    if (object.newEmail) await removeOtp(newEmail);
    if (object.newPhone) await removeOtp(newPhone);

    res.send({
      data: shop,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
