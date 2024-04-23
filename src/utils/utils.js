exports.generateRandomNumber = (numDigits) => {
  const maxNumber = 10 ** numDigits - 1;
  const randomNumber = Math.floor(Math.random() * (maxNumber + 1));
  const paddedNumber = randomNumber.toString().padStart(numDigits, '0');
  return paddedNumber;
};

exports.generateProductId = () => {
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
    return false;
  }
};

exports.isOnlyUpdateProductVariants = (productVariants) => productVariants.every((product) => {
  if (typeof product.id === 'undefined') {
    return false;
  }
  return product.options.every((option) => typeof option.variantId !== 'undefined' && typeof option.optionId !== 'undefined');
});
