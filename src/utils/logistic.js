const crypto = require('crypto');

require('dotenv').config();

exports.generateSignature = (content, keys, provider = null) => {
  const toSign = content + keys;
  let signature = '';
  if (provider === 'best') {
    signature = crypto.createHash('md5').update(toSign, 'utf8').digest('hex');
  } else {
    const hashBuffer = crypto.createHash('md5').update(toSign, 'utf8').digest();
    signature = hashBuffer.toString('base64');
  }
  return signature;
};
