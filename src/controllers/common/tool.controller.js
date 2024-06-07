const axios = require('axios');
const s3 = require('../../utils/s3');
const logger = require('../../utils/logger');
const db = require('../../models');

exports.generateThumbnails = async (req, res) => {
  try {
    const {
      ids,
    } = req.body;

    const products = await db.product.findAll({
      where: {
        id: ids,
      },
      attributes: ['id'],
    });

    const updatedProduct = [];

    for (const product of products) {
      const productImages = await product.getProductImages();
      const firstImage = productImages[0]?.file;
      if (firstImage) {
        const response = await axios.get(firstImage, { responseType: 'arraybuffer' });
        if (response) {
          const contentType = response.headers['content-type'];
          const mimetype = contentType ? contentType.split(';')[0] : 'application/octet-stream';
          const fileObject = {
            buffer: Buffer.from(response.data),
            originalname: 'thumbnail.jpg',
            mimetype,
          };
          uploadedFiles = await s3.upload([fileObject], 'public24/product/thumbnails', { dimensions: [404, 404] });
          await product.update({
            thumbnailImage: uploadedFiles[0],
          });
          updatedProduct.push({
            id: product.id,
            firstImage: productImages[0].file,
            thumbnailImage: uploadedFiles[0],
          });
        }
      }
    }

    res.json({
      data: updatedProduct,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
