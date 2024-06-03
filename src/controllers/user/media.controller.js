const logger = require('../../utils/logger');
const gcs = require('../../utils/gcs');

exports.uploadReviewMedia = async (req, res) => {
  try {
    const { files } = req.files;
    let uploadedFiles = [];
    if (files && files.length) {
      uploadedFiles = await gcs.upload(files, 'public/user/review/media');
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
