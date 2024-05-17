const logger = require('../../utils/logger');
const gcs = require('../../utils/gcs');

exports.uploadProductImages = async (req, res) => {
  try {
    const { files } = req.files;
    let uploadedFiles = [];
    if (files && files.length) {
      uploadedFiles = await gcs.upload(files, 'public/product/images');
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
      uploadedFiles = await gcs.upload(file, 'public/product/videos');
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
      uploadedFiles = await gcs.upload(file, 'public/product/variant_images');
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
