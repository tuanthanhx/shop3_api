const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');
const { getExtension } = require('./utils');
const logger = require('./logger');

require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.S3_BUCKET_NAME || '';
const datePath = dayjs().format('YYYYMM');
const prefixPath = process.env.NODE_ENV !== 'production' ? '__dev/' : '';

exports.upload = async (files, uploadPath) => {
  const uploadPromises = files.map(async (uploadedFile) => {
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const ext = getExtension(uploadedFile.originalname);
    const fileName = `${timestamp}-${uniqueId}.${ext}`;
    const filePath = `${prefixPath}${uploadPath}/${datePath}/${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: filePath,
      Body: uploadedFile.buffer,
      ContentType: uploadedFile.mimetype,
      ACL: 'public-read',
    };

    const upload = new Upload({
      client: s3Client,
      params,
    });

    try {
      await upload.done();
      const region = process.env.AWS_REGION;
      const url = `https://s3.${region}.amazonaws.com/${bucketName}/${filePath}`;
      return url;
    } catch (err) {
      logger.error('Error uploading to S3:', err);
      throw err;
    }
  });

  const uploadedFiles = await Promise.all(uploadPromises);

  return uploadedFiles;
};
