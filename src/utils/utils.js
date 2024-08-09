const axios = require('axios');
const { ethers } = require('ethers');
const crypto = require('crypto');
const path = require('path');
const logger = require('./logger');

require('dotenv').config();

exports.generateRandomNumber = (length) => {
  const maxNumber = 10 ** length - 1;
  const randomNumber = Math.floor(Math.random() * (maxNumber + 1));
  const paddedNumber = randomNumber.toString().padStart(length, '0');
  return paddedNumber;
};

exports.generateUniqueId = () => {
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString().slice(2, 9);
  return timestamp + randomPart;
};

exports.getFilename = (filename) => filename.split('.')[0];

exports.getExtension = (filename) => filename.split('.').pop();

exports.isImage = (file) => {
  const { mimetype } = file;
  const extname = path.extname(file.originalname).toLowerCase();
  const isValidExtension = ['.jpeg', '.jpg', '.png', '.gif'].includes(extname);
  const validImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const isValidMimeType = validImageMimeTypes.includes(mimetype);
  return isValidExtension && isValidMimeType;
};

exports.isValidJson = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

exports.tryParseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return jsonString;
  }
};

exports.isOnlyUpdateProductVariants = (productVariants) => productVariants.every((product) => {
  if (typeof product.id === 'undefined') {
    return false;
  }
  return product.options.every((option) => typeof option.variantId !== 'undefined' && typeof option.optionId !== 'undefined');
});

exports.getMinMaxPrice = (productVariants) => {
  if (!productVariants || productVariants.length === 0) return { minPrice: null, maxPrice: null };

  let minPrice = productVariants[0].price;
  let maxPrice = productVariants[0].price;

  for (let i = 1; i < productVariants.length; i++) {
    if (productVariants[i].price < minPrice) {
      minPrice = productVariants[i].price;
    }
    if (productVariants[i].price > maxPrice) {
      maxPrice = productVariants[i].price;
    }
  }

  return { minPrice, maxPrice };
};

exports.verifyCryptoPaySignature = (header, payload, timestampTolerance = 600) => {
  // Extract the timestamp and signature from the header
  const elements = header.split(',');

  const timestampElement = elements.find((element) => element.startsWith('t='));
  const signatureElement = elements.find((element) => element.startsWith('v1='));

  if (!timestampElement || !signatureElement) {
    throw new Error('Invalid header format');
  }

  const timestamp = timestampElement.split('=')[1];
  const signature = signatureElement.split('=')[1];

  // Prepare the signed payload string
  const signedPayload = `${timestamp}.${payload}`;

  // Determine the expected signature
  const expectedSignature = crypto.createHmac('sha256', Buffer.from(process.env.CRYPTO_API_SIGNATURE, 'base64'))
    .update(signedPayload)
    .digest('hex');

  // Constant-time string comparison
  const constantTimeCompare = (a, b) => {
    if (a.length !== b.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      // eslint-disable-next-line no-bitwise
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  };

  // Verify signature
  const isSignatureValid = constantTimeCompare(expectedSignature, signature);

  // Validate timestamp
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const isTimestampValid = Math.abs(currentTimestamp - parseInt(timestamp, 10)) <= timestampTolerance;

  return isSignatureValid && isTimestampValid;
};

exports.delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

exports.toHex = (str) => Buffer.from(str, 'utf8').toString('hex');

exports.fromHex = (hex) => Buffer.from(hex, 'hex').toString('utf8');

const networks = {
  ETH: {
    name: 'ETH',
    url: process.env.ETHSCAN_API_URL,
    apiKey: process.env.ETHSCAN_API_KEY,
    unit: 6,
  },
  BSC: {
    name: 'BSC',
    url: process.env.BSCSCAN_API_URL,
    apiKey: process.env.BSCSCAN_API_KEY,
    unit: 18,
  },
  POLYGON: {
    name: 'POLYGON',
    url: process.env.POLYGONSCAN_API_URL,
    apiKey: process.env.POLYGONSCAN_API_KEY,
    unit: 6,
  },
};

const getTransaction = async (hash, network) => {
  const response = await axios.get(`${network.url}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${network.apiKey}`);
  if (response.data && response.data.result) {
    const inputData = response.data.result.input;
    const receipt = await axios.get(`${network.url}?module=proxy&action=eth_getTransactionReceipt&txhash=${hash}&apikey=${network.apiKey}`);
    const status = receipt.data?.result?.status === '0x1' ? 2 : 1;
    return { inputData, status };
  }
  return null;
};

const decodeInputData = (inputData, unit) => {
  try {
    if (inputData && inputData.startsWith('0xa9059cbb')) {
      const addressLength = 64;
      const uint256Length = 64;

      const toData = `0x${inputData.slice(10, 10 + addressLength)}`;
      const rawAmountData = `0x${inputData.slice(10 + addressLength, 10 + addressLength + uint256Length)}`;

      const to = ethers.AbiCoder.defaultAbiCoder().decode(['address'], toData)[0];
      const weiAmount = ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], rawAmountData)[0];
      const amount = ethers.formatUnits(weiAmount, unit);

      const customDataHex = `0x${inputData.slice(10 + addressLength + uint256Length)}`;
      const customData = ethers.toUtf8String(customDataHex);

      return { to, amount, customData };
    }
  } catch (error) {
    console.error('Error decoding input data:', error);
  }
  return {};
};

exports.scanHash = async (hash, chainName = null) => {
  const chains = chainName ? [networks[chainName]] : Object.values(networks);

  for (const network of chains) {
    const result = await getTransaction(hash, network);
    if (result) {
      const { inputData, status } = result;
      const { to, amount, customData } = decodeInputData(inputData, network.unit);
      return {
        inputData,
        hash,
        network: network.name,
        to,
        amount,
        status,
        customData: this.fromHex(customData),
      };
    }
  }

  console.log(hash, 'Transaction not found on any network');
  return false;
};
