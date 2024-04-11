exports.generateRandomNumber = (numDigits) => {
  const maxNumber = 10 ** numDigits - 1;
  const randomNumber = Math.floor(Math.random() * (maxNumber + 1));
  const paddedNumber = randomNumber.toString().padStart(numDigits, '0');
  return paddedNumber;
};

exports.getExtension = (filename) => filename.split('.').pop();
