const { checkOtp, removeOtp } = require('../utils/otp');
const gcs = require('../utils/gcs');
const db = require('../models');

const Users = db.user;
const Shops = db.shop;
const SellerBusinessTypes = db.seller_business_type;

exports.getBusinessTypes = async (req, res) => {
  try {
    const data = await SellerBusinessTypes.findAll();
    res.send({
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createShop = async (req, res) => {
  const files = req.files?.slice(0, 3);
  const {
    businessType,
    shopName,
    registrationBusinessName,
    registrationBusinessNumber,
    registrationOwnerName,
    registrationOwnerId,
    subscribeMailingList,
    useCurrentEmail,
    newEmail,
    newEmailOtp,
    useCurrentPhone,
    newPhone,
    newPhoneOtp,
  } = req.body;

  const { id: userId } = req.user;

  const foundUser = await Users.findByPk(userId);
  if (!foundUser) {
    res.status(400).send({
      message: 'Cannot find data with the current user',
    });
    return;
  }

  const object = {
    sellerBusinessTypeId: businessType,
    shopName,
    userId,
    subscribeMailingList,
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

  if (businessType === 1) { // Household
    object.registrationBusinessName = registrationBusinessName;
    object.registrationBusinessNumber = registrationBusinessNumber;
    object.registrationOwnerName = registrationOwnerName;
    object.registrationOwnerId = registrationOwnerId;

    if (files.length < 3) {
      res.status(400).send({
        message: 'Not providing enough document files',
      });
      return;
    }
  } else if (businessType === 2) { // Individual
    if (files.length < 2) {
      res.status(400).send({
        message: 'Not providing enough document files',
      });
      return;
    }
  } else if (businessType === 3) { // Corporate
    if (files.length < 3) {
      res.status(400).send({
        message: 'Not providing enough document files',
      });
      return;
    }
  }

  try {
    const foundSellerBusinessType = await SellerBusinessTypes.findOne({
      where: { id: businessType },
    });
    if (!foundSellerBusinessType) {
      res.status(400).send({
        message: 'The provied businessType is invalid',
      });
      return;
    }

    const foundShop = await Shops.findOne({ where: { userId } });
    if (foundShop) {
      res.status(400).send({
        message: 'This user already has a shop',
      });
      return;
    }

    let uploadedFiles = [];
    if (files.length) {
      uploadedFiles = await gcs.upload(files, 'public/seller/files');
      if (!uploadedFiles) {
        res.status(500).send({
          message: 'Failed to upload files',
        });
        return;
      }

      if (businessType === 1) { // Household
        if (uploadedFiles.length >= 3) {
          const [registrationDocument1, registrationDocument2, registrationDocument3] = uploadedFiles;
          object.registrationDocument1 = registrationDocument1;
          object.registrationDocument2 = registrationDocument2;
          object.registrationDocument3 = registrationDocument3;
        }
      } else if (businessType === 2) { // Individual
        if (uploadedFiles.length >= 2) {
          const [identityCardFront, identityCardBack] = uploadedFiles;
          object.identityCardFront = identityCardFront;
          object.identityCardBack = identityCardBack;
        }
      } else if (businessType === 3) { // Corporate
        if (uploadedFiles.length >= 3) {
          const [registrationDocument1, registrationDocument2, registrationDocument3] = uploadedFiles;
          object.registrationDocument1 = registrationDocument1;
          object.registrationDocument2 = registrationDocument2;
          object.registrationDocument3 = registrationDocument3;
        }
      }
    }

    const data = await Shops.create(object);

    if (data) {
      await removeOtp(newEmail);
      await removeOtp(newPhone);
    }

    res.send({
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
