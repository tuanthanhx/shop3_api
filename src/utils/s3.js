const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const dayjs = require('dayjs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { getExtension, isImage } = require('./utils');
const logger = require('./logger');

require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
});

const bucketName = process.env.AWS_S3_BUCKET || '';
const datePath = dayjs().format('YYYYMM');
const prefixPath = process.env.NODE_ENV !== 'production' ? '__dev/' : '';

exports.upload = async (files, uploadPath, options = null) => {
  const uploadPromises = files.map(async (uploadedFile) => {
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const ext = getExtension(uploadedFile.originalname);

    let processedFile;
    if (isImage(uploadedFile)) {
      const image = sharp(uploadedFile.buffer);
      if (!options?.dimensions) {
        processedFile = {
          ...uploadedFile,
          buffer: await image.resize({
            width: 2000,
            height: 2000,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          }).toBuffer(),
        };
      } else {
        const [width, height] = options.dimensions;
        processedFile = {
          ...uploadedFile,
          buffer: await image.resize({
            width,
            height,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          }).toBuffer(),
        };
      }
    } else {
      processedFile = uploadedFile;
    }

    const fileName = `${timestamp}-${uniqueId}.${ext}`;
    const filePath = `${prefixPath}${uploadPath}/${datePath}/${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: filePath,
      Body: processedFile.buffer,
      ContentType: processedFile.mimetype,
      ACL: 'public-read',
    };

    const upload = new Upload({
      client: s3Client,
      params,
    });

    try {
      await upload.done();
      const region = process.env.AWS_S3_REGION;
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

exports.delete = async (key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (err) {
    logger.error('Error deleting object from S3:', err);
    throw err;
  }
};
