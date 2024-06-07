const logger = require('../../utils/logger');
const s3 = require('../../utils/s3');

exports.uploadProductImages = async (req, res) => {
  try {
    const { files } = req.files;
    let uploadedFiles = [];
    if (files && files.length) {
      uploadedFiles = await s3.upload(files, 'public24/product/images', { dimensions: [1080, 1080], thumbnails: [404, 404] });
    } else {
      res.status(400).send({
        message: 'No files to upload',
      });
      return;
    }
    res.send({
      data: uploadedFiles,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.uploadProductVideo = async (req, res) => {
  try {
    const { file } = req.files;
    let uploadedFiles = [];
    if (file && file.length) {
      uploadedFiles = await s3.upload(file, 'public24/product/videos');
    } else {
      res.status(400).send({
        message: 'No files to upload',
      });
      return;
    }
    res.send({
      data: uploadedFiles[0],
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.uploadProductVariantImage = async (req, res) => {
  try {
    const { file } = req.files;
    let uploadedFiles = [];
    if (file && file.length) {
      uploadedFiles = await s3.upload(file, 'public24/product/variant_images', { dimensions: [1080, 1080], thumbnails: [404, 404] });
    } else {
      res.status(400).send({
        message: 'No files to upload',
      });
      return;
    }
    res.send({
      data: uploadedFiles[0],
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
