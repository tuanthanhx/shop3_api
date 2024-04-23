const gcs = require('../utils/gcs');

exports.uploadProductImages = async (req, res) => {
  try {
    const { files } = req.files;
    let uploadedFiles = [];
    if (files?.length) {
      uploadedFiles = await gcs.upload(files, 'public/product/images');
    }
    res.send({
      data: uploadedFiles,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.uploadProductVideo = async (req, res) => {
  try {
    const { file } = req.files;
    let uploadedFiles = [];
    if (file?.length) {
      uploadedFiles = await gcs.upload(file, 'public/product/videos');
    }
    res.send({
      data: uploadedFiles[0],
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.uploadProductVariantImage = async (req, res) => {
  try {
    const { file } = req.files;
    let uploadedFiles = [];
    if (file?.length) {
      uploadedFiles = await gcs.upload(file, 'public/product/variant_images');
    }
    res.send({
      data: uploadedFiles[0],
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
