const logger = require('./logger');

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
