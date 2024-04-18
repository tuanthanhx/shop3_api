module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const sellers = require('../controllers/seller.controller');
  const rules = require('../rules/seller.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/business_types', sellers.getBusinessTypes);
  router.get('/verification', sellers.getVerification);
  router.post('/verification', upload.fields([
    { name: 'householdBusinessRegistrationDocument1', maxCount: 1 },
    { name: 'householdBusinessRegistrationDocument2', maxCount: 1 },
    { name: 'householdBusinessRegistrationDocument3', maxCount: 1 },
    { name: 'individualIdentityCardFront', maxCount: 1 },
    { name: 'individualIdentityCardBack', maxCount: 1 },
    { name: 'corporateCompanyRegistrationDocument1', maxCount: 1 },
    { name: 'corporateCompanyRegistrationDocument2', maxCount: 1 },
    { name: 'corporateCompanyRegistrationDocument3', maxCount: 1 },
  ]), rules.updateVerification, sellers.updateVerification);

  app.use(`/api/${apiVersion}/sellers`, router);
};
