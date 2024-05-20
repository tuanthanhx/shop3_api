module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const sellers = require('../../controllers/seller/seller.controller');
  const rules = require('../../rules/seller.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/business_types', rules.getBusinessTypes, sellers.getBusinessTypes);

  router.get('/logistics_services', sellers.getLogisticsServices);
  router.post('/logistics_services/subscribe', sellers.subscribeLogisticsServices);
  router.post('/logistics_services/unsubscribe', sellers.unsubscribeLogisticsServices);
  router.post('/logistics_services/estimate_shipping_fee', sellers.estimateShippingFee);

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
  ]), rules.createVerification, sellers.createVerification);
  router.put('/verification', upload.fields([
    { name: 'householdBusinessRegistrationDocument1', maxCount: 1 },
    { name: 'householdBusinessRegistrationDocument2', maxCount: 1 },
    { name: 'householdBusinessRegistrationDocument3', maxCount: 1 },
    { name: 'individualIdentityCardFront', maxCount: 1 },
    { name: 'individualIdentityCardBack', maxCount: 1 },
    { name: 'corporateCompanyRegistrationDocument1', maxCount: 1 },
    { name: 'corporateCompanyRegistrationDocument2', maxCount: 1 },
    { name: 'corporateCompanyRegistrationDocument3', maxCount: 1 },
  ]), rules.updateVerification, sellers.updateVerification);

  app.use(`/api-seller/${apiVersion}/sellers`, router);
};
