const axios = require('axios');
const qs = require('qs');
const logger = require('../../utils/logger');
const { generateSignature } = require('../../utils/logistic');
// const db = require('../../models');

exports.createOrder = async (req, res) => {
  try {
    const { content } = req.body; // TODO: Pass Shop3 order detail to here
    const contentString = JSON.stringify(content);
    /*
    const contentString = `{
    "outOrderId": "SHOP3_TEST_order202408290001",
    "tradeOrderParam": {
        "tradeOrderId": "",
        "createTime": "1724816234",
        "payTime": "1724816234"
    },
    "solutionParam": {
        "solutionCode": "CN_GLO_STD",
        "importCustomsParam": {
            "taxNumber": "P210001518521"
        }
    },
    "packageParams": {
        "packageParam": {
            "length": "24",
            "width": "10",
            "height": "5",
            "weight": "500",
            "itemParams": {
                "itemParam": {
                    "itemId": "373871",
                    "quantity": "1",
                    "englishName": "1000 pieces adult kids paper jigsaw puzzles e",
                    "chineseName": "75*50cm 1000片拼图 成人儿童大型拼图益智减压玩",
                    "unitPrice": "25",
                    "unitPriceCurrency": "USD",
                    "sku": "373871",
                    "hscode": "6103320000",
                    "weight": "500",
                    "clearanceShipVat": "8.8",
                    "clearanceUnitPrice": "25",
                    "clearanceShipUnitPrice": "25",
                    "taxCurrency": "EUR",
                    "taxRate": "0.22",
                    "clearanceVat": "330.44",
                    "itemUrl": "www.baidu.com"
                }
            }
        }
    },
    "senderParam": {
        "name": "ZhongWeiXin",
        "mobilePhone": "01064656790",
        "email": "43534@qq.com",
        "zipCode": "34424",
        "countryCode": "CN",
        "state": "浙江",
        "city": "杭州市",
        "district": "西湖",
        "street": "靖江",
        "detailAddress": "空港保税物流园"
    },
    "receiverParam": {
        "name": "이보영",
        "telephone": "010-21725326",
        "mobilePhone": "010-21725326",
        "countryCode": "KR",
        "state": "Seoul Special City",
        "city": "Gangnam-gu",
        "detailAddress": "166 Samseong-dong",
        "zipCode": "06018",
        "email": "vzjhyozjcq@iubridge.com"
    },
    "syncGetTrackingNumber": "true"
}`;
*/
    const signature = generateSignature(contentString, process.env.CAINIAO_APP_SECRET);

    const data = {
      msg_type: 'cnge.order.create',
      logistic_provider_id: process.env.CAINIAO_RESOURCE_CODE,
      data_digest: signature,
      to_code: 'CNGCP-OPEN',
      logistics_interface: contentString,
    };

    const response = await axios.post(process.env.CAINIAO_API_URL, qs.stringify(data), {
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
        content,
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
    const { content } = req.body; // TODO: Pass Shop3 order detail to here
    const contentString = JSON.stringify(content);
    const signature = generateSignature(contentString, process.env.CAINIAO_APP_SECRET);

    const data = {
      msg_type: 'cnge.order.cancel',
      logistic_provider_id: process.env.CAINIAO_RESOURCE_CODE,
      data_digest: signature,
      to_code: 'CNGCP-OPEN',
      logistics_interface: contentString,
    };

    const response = await axios.post(process.env.CAINIAO_API_URL, qs.stringify(data), {
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
        content,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { content } = req.body; // TODO: Pass Shop3 order detail to here
    // const contentString = JSON.stringify(content);
    const contentString = `{
        "waybillType": 1,
        "orderCode": "LP00672818399569",
        "locale": "zh_CN",
        "needSelfDrawLabels": true
    }`;
    const signature = generateSignature(contentString, process.env.CAINIAO_APP_SECRET);

    const data = {
      msg_type: 'cnge.waybill.get',
      logistic_provider_id: process.env.CAINIAO_RESOURCE_CODE,
      data_digest: signature,
      to_code: 'CGOP',
      logistics_interface: contentString,
    };

    const response = await axios.post(process.env.CAINIAO_API_URL, qs.stringify(data), {
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
        content,
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
