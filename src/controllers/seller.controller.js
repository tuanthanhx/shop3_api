const gcs = require('../utils/gcs');
const db = require('../models');

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
  const {
    businessType,
    shopName,
    registrationBusinessName,
    registrationBusinessNumber,
    registrationOwnerName,
    registrationOwnerId,
  } = req.body;

  const { id: userId } = req.user;

  const object = {
    seller_business_type_id: businessType,
    shop_name: shopName,
    user_id: userId,
  };

  if (businessType === 1) { // Household
    object.registration_business_name = registrationBusinessName;
    object.registration_business_number = registrationBusinessNumber;
    object.registration_owner_name = registrationOwnerName;
    object.registration_owner_id = registrationOwnerId;
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

    const foundShop = await Shops.findOne({ where: { user_id: userId } });
    if (foundShop) {
      res.status(400).send({
        message: 'This user already has a shop',
      });
      return;
    }

    const files = req.files?.slice(0, 3);
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
          object.registration_document_1 = registrationDocument1;
          object.registration_document_2 = registrationDocument2;
          object.registration_document_3 = registrationDocument3;
        }
      }

      if (businessType === 2) { // Individual
        if (uploadedFiles.length >= 2) {
          const [identityCardFront, identityCardBack] = uploadedFiles;
          object.identity_card_front = identityCardFront;
          object.identity_card_back = identityCardBack;
        }
      }

      if (businessType === 3) { // Corporate
        if (uploadedFiles.length >= 3) {
          const [registrationDocument1, registrationDocument2, registrationDocument3] = uploadedFiles;
          object.registration_document_1 = registrationDocument1;
          object.registration_document_2 = registrationDocument2;
          object.registration_document_3 = registrationDocument3;
        }
      }
    }

    const data = await Shops.create(object);

    res.send({
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
