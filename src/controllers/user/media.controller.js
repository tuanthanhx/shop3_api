const logger = require('../../utils/logger');
const s3 = require('../../utils/s3');

exports.uploadReviewMedia = async (req, res) => {
  try {
    const { files } = req.files;
    let uploadedFiles = [];
    if (files && files.length) {
      uploadedFiles = await s3.upload(files, 'public24/user/review', { dimensions: [1000, 1000], thumbnails: [200, 200] });
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
