const { body } = require('express-validator');
const { validateRules, handleMulterErrors } = require('../middlewares/validators');

exports.createVerification = [
  body('businessType')
    .notEmpty()
    .withMessage('businessType is required')
    .toInt(),
  body('shopName')
    .notEmpty()
    .withMessage('shopName is required')
    .trim(),
  body('useCurrentEmail')
    .optional()
    .toBoolean(),
  body('useCurrentPhone')
    .optional()
    .toBoolean(),
  body('newEmail')
    .optional()
    .isEmail()
    .withMessage('newEmail is invalid format')
    .trim(),
  body('newPhone')
    .optional()
    .matches(/^[\d ()\-+\s]+$/)
    .withMessage('newPhone is invalid format')
    .trim(),
  body('subscribeMailingList')
    .optional()
    .toBoolean(),
  body('individualProductCategoryId')
    .optional()
    .toInt(),
  body('isSubmitted')
    .optional()
    .toBoolean(),
  body('householdBusinessRegistrationDocument1').custom((value, { req }) => {
    if (req.files && req.files.householdBusinessRegistrationDocument1) {
      const file = req.files.householdBusinessRegistrationDocument1[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('householdBusinessRegistrationDocument1 must be less than 10MB');
      }
    }
    return true;
  }),
  body('householdBusinessRegistrationDocument2').custom((value, { req }) => {
    if (req.files && req.files.householdBusinessRegistrationDocument2) {
      const file = req.files.householdBusinessRegistrationDocument2[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('householdBusinessRegistrationDocument2 must be less than 10MB');
      }
    }
    return true;
  }),
  body('householdBusinessRegistrationDocument3').custom((value, { req }) => {
    if (req.files && req.files.householdBusinessRegistrationDocument3) {
      const file = req.files.householdBusinessRegistrationDocument3[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('householdBusinessRegistrationDocument3 must be less than 10MB');
      }
    }
    return true;
  }),
  body('individualIdentityCardFront').custom((value, { req }) => {
    if (req.files && req.files.individualIdentityCardFront) {
      const file = req.files.individualIdentityCardFront[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('individualIdentityCardFront must be less than 10MB');
      }
    }
    return true;
  }),
  body('individualIdentityCardBack').custom((value, { req }) => {
    if (req.files && req.files.individualIdentityCardBack) {
      const file = req.files.individualIdentityCardBack[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('individualIdentityCardBack must be less than 10MB');
      }
    }
    return true;
  }),
  body('corporateCompanyRegistrationDocument1').custom((value, { req }) => {
    if (req.files && req.files.corporateCompanyRegistrationDocument1) {
      const file = req.files.corporateCompanyRegistrationDocument1[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('corporateCompanyRegistrationDocument1 must be less than 10MB');
      }
    }
    return true;
  }),
  body('corporateCompanyRegistrationDocument2').custom((value, { req }) => {
    if (req.files && req.files.corporateCompanyRegistrationDocument2) {
      const file = req.files.corporateCompanyRegistrationDocument2[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('corporateCompanyRegistrationDocument2 must be less than 10MB');
      }
    }
    return true;
  }),
  body('corporateCompanyRegistrationDocument3').custom((value, { req }) => {
    if (req.files && req.files.corporateCompanyRegistrationDocument3) {
      const file = req.files.corporateCompanyRegistrationDocument3[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('corporateCompanyRegistrationDocument3 must be less than 10MB');
      }
    }
    return true;
  }),
  validateRules,
  handleMulterErrors,
];

exports.updateVerification = [
  body('businessType')
    .optional()
    .toInt(),
  body('shopName')
    .optional()
    .trim(),
  body('useCurrentEmail')
    .optional()
    .toBoolean(),
  body('useCurrentPhone')
    .optional()
    .toBoolean(),
  body('newEmail')
    .optional()
    .isEmail()
    .withMessage('newEmail is invalid format')
    .trim(),
  body('newPhone')
    .optional()
    .matches(/^[\d ()\-+\s]+$/)
    .withMessage('newPhone is invalid format')
    .trim(),
  body('subscribeMailingList')
    .optional()
    .toBoolean(),
  body('individualProductCategoryId')
    .optional()
    .toInt(),
  body('isSubmitted')
    .optional()
    .toBoolean(),
  body('householdBusinessRegistrationDocument1').custom((value, { req }) => {
    if (req.files && req.files.householdBusinessRegistrationDocument1) {
      const file = req.files.householdBusinessRegistrationDocument1[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('householdBusinessRegistrationDocument1 must be less than 10MB');
      }
    }
    return true;
  }),
  body('householdBusinessRegistrationDocument2').custom((value, { req }) => {
    if (req.files && req.files.householdBusinessRegistrationDocument2) {
      const file = req.files.householdBusinessRegistrationDocument2[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('householdBusinessRegistrationDocument2 must be less than 10MB');
      }
    }
    return true;
  }),
  body('householdBusinessRegistrationDocument3').custom((value, { req }) => {
    if (req.files && req.files.householdBusinessRegistrationDocument3) {
      const file = req.files.householdBusinessRegistrationDocument3[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('householdBusinessRegistrationDocument3 must be less than 10MB');
      }
    }
    return true;
  }),
  body('individualIdentityCardFront').custom((value, { req }) => {
    if (req.files && req.files.individualIdentityCardFront) {
      const file = req.files.individualIdentityCardFront[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('individualIdentityCardFront must be less than 10MB');
      }
    }
    return true;
  }),
  body('individualIdentityCardBack').custom((value, { req }) => {
    if (req.files && req.files.individualIdentityCardBack) {
      const file = req.files.individualIdentityCardBack[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('individualIdentityCardBack must be less than 10MB');
      }
    }
    return true;
  }),
  body('corporateCompanyRegistrationDocument1').custom((value, { req }) => {
    if (req.files && req.files.corporateCompanyRegistrationDocument1) {
      const file = req.files.corporateCompanyRegistrationDocument1[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('corporateCompanyRegistrationDocument1 must be less than 10MB');
      }
    }
    return true;
  }),
  body('corporateCompanyRegistrationDocument2').custom((value, { req }) => {
    if (req.files && req.files.corporateCompanyRegistrationDocument2) {
      const file = req.files.corporateCompanyRegistrationDocument2[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('corporateCompanyRegistrationDocument2 must be less than 10MB');
      }
    }
    return true;
  }),
  body('corporateCompanyRegistrationDocument3').custom((value, { req }) => {
    if (req.files && req.files.corporateCompanyRegistrationDocument3) {
      const file = req.files.corporateCompanyRegistrationDocument3[0];
      const fileSize = file.size;
      if (fileSize > 10485760) {
        throw new Error('corporateCompanyRegistrationDocument3 must be less than 10MB');
      }
    }
    return true;
  }),
  validateRules,
  handleMulterErrors,
];
