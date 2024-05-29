const AWS = require('aws-sdk');
const { getFilename, getExtension } = require('./utils');
const logger = require('./logger');

require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.S3_BUCKET_NAME || '';

exports.upload = async (files, uploadPath) => {
  const uploadPromises = files.map(async (uploadedFile) => {
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString().slice(2, 9);
    const fileName = `${timestamp}${randomPart}_${getFilename(uploadedFile.originalname)}.${getExtension(uploadedFile.originalname)}`;
    const filePath = `${uploadPath}/${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: filePath,
      Body: uploadedFile.buffer,
      ContentType: uploadedFile.mimetype,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          logger.error('Error uploading to S3:', err);
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  });

  const uploadedFiles = await Promise.all(uploadPromises);

  const publicUrls = uploadedFiles.map((filePath) => filePath);
  return publicUrls;
};
