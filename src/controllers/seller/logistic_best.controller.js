const axios = require('axios');
const qs = require('qs');
// const fs = require('fs');
const logger = require('../../utils/logger');
const logisticService = require('../../services/logistic');
// const db = require('../../models');

exports.estimateFee = async (req, res) => {
  try {
    // const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
      "customerName": "YiNian Fashion (Shanghai) Co., Ltd. - Shanghai O2O",
      "txLogisticId": "TO1725248886000001",
      "serviceType": "1",
      "goodsValue": "100",
      "itemsValue": "0",
      "insuranceValue": "0",
      "special": "0",
      "certificateType": "01",
      "certificateNo": "1769900274531",
      "sender": {
        "name": "Zhang Wei",
        "postCode": "200000",
        "mobile": "13800138000",
        "prov": "Shanghai",
        "city": "Shanghai",
        "county": "Pudong New District",
        "address": "2000 Pudong Avenue",
        "email": "sender@example.com",
        "country": "03"
      },
      "receiver": {
        "name": "Li Jing",
        "postCode": "100000",
        "mobile": "13911112222",
        "prov": "Beijing",
        "city": "Beijing",
        "county": "Chaoyang District",
        "address": "88 Jianguo Road",
        "email": "receiver@example.com",
        "country": "03"
      },
      "items": {
        "item": {
          "itemName": "document"
        }
      },
      "itemsWeight": "3",
      "piece": "1",
      "remark": ""
    }`;
    const signature = logisticService.generateSignature(contentString, process.env.BEST_PARTNER_KEY, 'best');

    const data = {
      serviceType: 'KD_ORDER_FEE',
      bizData: contentString,
      sign: signature,
      partnerID: process.env.BEST_PARTNER_ID,
      partnerKey: process.env.BEST_PARTNER_KEY,
    };

    const response = await axios.post(process.env.BEST_API_URL, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response) {
      res.status(400).send({
        message: 'Error while calling 3rd-parties API',
      });
      return;
    }

    res.status(200).json({
      data: response.data,
      debug: { // TODO: Remove debug later
        signature,
        contentString,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    // const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
      "customerName": "YiNian Fashion (Shanghai) Co., Ltd. - Shanghai O2O",
      "txLogisticId": "TO1702200461625555",
      "serviceType": "1",
      "goodsValue": "100",
      "itemsValue": "0",
      "insuranceValue": "0",
      "special": "0",
      "certificateType": "01",
      "certificateNo": "1769900274531",
      "sender": {
        "name": "sender",
        "postCode": "10254",
        "mobile": "13668122696",
        "prov": "Kampong Thom",
        "city": "Stoung",
        "county": "Chamna Leu",
        "address": "123",
        "email": "kkk@email.com",
        "country": "01"
      },
      "receiver": {
        "name": "receiver",
        "postCode": "50110",
        "mobile": "13927089988",
        "prov": "Kandal",
        "city": "Kandal Stueng",
        "county": "Ampov Prey",
        "address": "456",
        "email": "kkk@email.com",
        "country": "01"
      },
      "items": {
        "item": {
          "itemName": "document"
        }
      },
      "itemsWeight": "3",
      "piece": "1",
      "remark": ""
    }`;
    const signature = logisticService.generateSignature(contentString, process.env.BEST_PARTNER_KEY, 'best');

    const data = {
      serviceType: 'KD_CREATE_WAYBILL_ORDER_NOTIFY',
      bizData: contentString,
      sign: signature,
      partnerID: process.env.BEST_PARTNER_ID,
      partnerKey: process.env.BEST_PARTNER_KEY,
    };

    const response = await axios.post(process.env.BEST_API_URL, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response) {
      res.status(400).send({
        message: 'Error while calling 3rd-parties API',
      });
      return;
    }

    res.status(200).json({
      data: response.data,
      debug: { // TODO: Remove debug later
        signature,
        contentString,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.createOrderPdf = async (req, res) => {
  try {
    // const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
      "customerName": "YiNian Fashion (Shanghai) Co., Ltd. - Shanghai O2O",
      "txLogisticId": "TO1702200461625999",
      "serviceType": "1",
      "goodsValue": "100",
      "itemsValue": "0",
      "insuranceValue": "0",
      "special": "0",
      "certificateType": "01",
      "certificateNo": "1769900274531",
      "sender": {
        "name": "sender",
        "postCode": "10254",
        "mobile": "13668122696",
        "prov": "Kampong Thom",
        "city": "Stoung",
        "county": "Chamna Leu",
        "address": "123",
        "email": "kkk@email.com",
        "country": "01"
      },
      "receiver": {
        "name": "receiver",
        "postCode": "50110",
        "mobile": "13927089988",
        "prov": "Kandal",
        "city": "Kandal Stueng",
        "county": "Ampov Prey",
        "address": "456",
        "email": "kkk@email.com",
        "country": "01"
      },
      "items": {
        "item": {
          "itemName": "document"
        }
      },
      "itemsWeight": "3",
      "piece": "1",
      "remark": ""
    }`;
    const signature = logisticService.generateSignature(contentString, process.env.BEST_PARTNER_KEY, 'best');

    const data = {
      serviceType: 'KD_CREATE_WAYBILL_ORDER_PDF_NOTIFY',
      bizData: contentString,
      sign: signature,
      partnerID: process.env.BEST_PARTNER_ID,
      partnerKey: process.env.BEST_PARTNER_KEY,
    };

    const response = await axios.post(process.env.BEST_API_URL, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response) {
      res.status(400).send({
        message: 'Error while calling 3rd-parties API',
      });
      return;
    }

    /*
    const base64Data = response.data.pdfStream;

    // Convert the base64 string to a Buffer
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Write the Buffer to a PDF file
    fs.writeFileSync('output.pdf', pdfBuffer);

    console.log('PDF file created successfully.');
    */

    res.status(200).json({
      data: response.data,
      debug: { // TODO: Remove debug later
        signature,
        contentString,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    // const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
      "txLogisticId": "TO1702200461625555",
      "mailNo": "84855027481855",
      "packageStatusCode": "delivered",
      "statusCodeDesc": "delivered",
      "operateTime": "2024-08-31 23:02:25",
      "pushTime": "2024-08-31 23:02:25",
      "currentCity": "Kandal",
      "remark": "Shipment【signPOD】,Recipient type【Consignee】, POD by 【123】,POD station is 【testsiteA】, POD scan updated by 【testsitea】",
      "weight": "3.0"
    }`;
    const signature = logisticService.generateSignature(contentString, process.env.BEST_PARTNER_KEY, 'best');

    const data = {
      serviceType: 'KD_ORDER_STATUS_PUSH',
      bizData: contentString,
      sign: signature,
      partnerID: process.env.BEST_PARTNER_ID,
      partnerKey: process.env.BEST_PARTNER_KEY,
    };

    const response = await axios.post(process.env.BEST_API_URL, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response) {
      res.status(400).send({
        message: 'Error while calling 3rd-parties API',
      });
      return;
    }

    res.status(200).json({
      data: response.data,
      debug: { // TODO: Remove debug later
        signature,
        contentString,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    // const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
      "langType": "en-US",
      "mailNos": {
        "mailNo": [
          "84855027481855"
        ]
      },
    }`;
    const signature = logisticService.generateSignature(contentString, process.env.BEST_PARTNER_KEY, 'best');

    const data = {
      serviceType: 'KD_TRACE_QUERY',
      bizData: contentString,
      sign: signature,
      partnerID: process.env.BEST_PARTNER_ID,
      partnerKey: process.env.BEST_PARTNER_KEY,
    };

    const response = await axios.post(process.env.BEST_API_URL, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response) {
      res.status(400).send({
        message: 'Error while calling 3rd-parties API',
      });
      return;
    }

    res.status(200).json({
      data: response.data,
      debug: { // TODO: Remove debug later
        signature,
        contentString,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    // const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
      "txLogisticId": "TO1702200461625999",
      "reason": "Don't want to buy."
    }`;
    const signature = logisticService.generateSignature(contentString, process.env.BEST_PARTNER_KEY, 'best');

    const data = {
      serviceType: 'KD_CANCEL_ORDER_NOTIFY',
      bizData: contentString,
      sign: signature,
      partnerID: process.env.BEST_PARTNER_ID,
      partnerKey: process.env.BEST_PARTNER_KEY,
    };

    const response = await axios.post(process.env.BEST_API_URL, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response) {
      res.status(400).send({
        message: 'Error while calling 3rd-parties API',
      });
      return;
    }

    res.status(200).json({
      data: response.data,
      debug: { // TODO: Remove debug later
        signature,
        contentString,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    // const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
      "params": {
        "senderName": "zhangsan",
        "senderPostcode": "12313"
      },
      "txLogisticId": "TO1702200461625999"
    }`;
    const signature = logisticService.generateSignature(contentString, process.env.BEST_PARTNER_KEY, 'best');

    const data = {
      serviceType: 'KD_UPDATE_ORDER_NOTIFY',
      bizData: contentString,
      sign: signature,
      partnerID: process.env.BEST_PARTNER_ID,
      partnerKey: process.env.BEST_PARTNER_KEY,
    };

    const response = await axios.post(process.env.BEST_API_URL, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response) {
      res.status(400).send({
        message: 'Error while calling 3rd-parties API',
      });
      return;
    }

    res.status(200).json({
      data: response.data,
      debug: { // TODO: Remove debug later
        signature,
        contentString,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
