const { Storage } = require('@google-cloud/storage');
const { getFilename, getExtension } = require('./utils');

require('dotenv').config();

const storage = new Storage({
  keyFilename: process.env.GCS_KEY_FILE || '',
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

exports.upload = async (files, uploadPath) => {
  const uploadPromises = files.map(async (uploadedFile) => {
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString().slice(2, 9);
    const fileName = `${timestamp}${randomPart}_${getFilename(uploadedFile.originalname)}.${getExtension(uploadedFile.originalname)}`;
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
