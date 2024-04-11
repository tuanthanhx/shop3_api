const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const { getExtension } = require('./utils');

require('dotenv').config();

const storage = new Storage({
  keyFilename: process.env.GCS_KEY_FILE || '',
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

exports.upload = async (files, uploadPath) => {
  const uploadPromises = files.map(async (uploadedFile) => {
    const fileName = `${uploadedFile.fieldname}_${uuidv4()}.${getExtension(uploadedFile.originalname)}`;
    const filePath = `${uploadPath}/${fileName}`;

    const file = bucket.file(filePath);
    const fileStream = file.createWriteStream({
      metadata: {
        contentType: uploadedFile.mimetype,
        acl: [{ entity: 'allUsers', role: 'READER' }],
      },
    });

    fileStream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      return false;
    });

    return new Promise((resolve) => {
      fileStream.on('finish', () => {
        resolve(`${process.env.GCS_HOST_ADDRESS}/${bucket.name}/${filePath}`);
      });
      fileStream.end(uploadedFile.buffer);
    });
  });

  const uploadedFiles = await Promise.all(uploadPromises);

  const publicUrls = uploadedFiles.map((filePath) => filePath);
  return publicUrls;
};
