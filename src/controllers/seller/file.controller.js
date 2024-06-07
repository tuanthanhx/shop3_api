const logger = require('../../utils/logger');
const s3 = require('../../utils/s3');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      folder,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {
      userId,
    };
    if (folder) {
      condition.folder = folder;
    }

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'createdAt', 'updatedAt'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        ordering = [[sortField, sortOrder.toUpperCase()]];
      }
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;

    const queryOptions = {
      where: condition,
      order: ordering,
      attributes: ['id', 'file', 'createdAt'],
    };

    const data = await db.file.findAndCountAll(queryOptions);

    const { count, rows } = data;
    const totalPages = limitPerPage === -1 ? 1 : Math.ceil(count / limitPerPage);

    res.json({
      totalItems: count,
      totalPages,
      currentPage: pageNo,
      data: rows,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { file } = req.files;
    const { folder } = req.body;

    let uploadedFiles = [];
    if (file && file.length) {
      uploadedFiles = await s3.upload(file, 'public24/user/files');
    } else {
      res.status(400).send({
        message: 'No files to upload',
      });
      return;
    }

    const bucketName = process.env.S3_BUCKET_NAME || '';
    const region = process.env.AWS_REGION;

    const createdFile = await db.file.create({
      file: uploadedFiles[0],
      folder: folder || 'root',
      key: uploadedFiles[0]?.replace(`https://s3.${region}.amazonaws.com/${bucketName}/`, ''),
      userId,
    });

    const data = await db.file.findByPk(createdFile.id, {
      attributes: ['id', 'file', 'createdAt'],
    });

    res.send({
      data,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const { id } = req.params;

    const file = await db.file.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!file) {
      res.status(404).send({
        message: 'File not found',
      });
      return;
    }

    await file.destroy();
    if (file.key) {
      await s3.delete(file.key);
    }

    res.json({
      data: {
        message: 'File deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
