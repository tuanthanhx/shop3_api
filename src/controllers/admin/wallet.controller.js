const logger = require('../../utils/logger');
const db = require('../../models');

exports.getWithdrawals = async (req, res) => {
  try {
    const {
      withdrawalStatusId,
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const condition = {};

    if (withdrawalStatusId) {
      condition.withdrawalStatusId = withdrawalStatusId;
    }

    let ordering = [['id', 'DESC']];

    if (sortField && sortOrder) {
      const validSortFields = ['id', 'description', 'amount', 'createdAt'];
      const validSortOrder = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortOrder.includes(sortOrder.toLowerCase())) {
        ordering = [[sortField, sortOrder.toUpperCase()]];
      }
    }

    const pageNo = parseInt(page, 10) || 1;
    const limitPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNo - 1) * limitPerPage;

    const data = await db.withdrawal.findAndCountAll({
      where: condition,
      distinct: true,
      order: ordering,
      limit: limitPerPage,
      offset,
    });

    const { count, rows } = data;
    const totalPages = Math.ceil(count / limitPerPage);

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

exports.getWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await db.withdrawal.findOne({
      where: {
        id,
      },
      include: [{
        model: db.withdrawal_status,
        as: 'withdrawalStatus',
        attributes: ['name'],
      }],
    });

    if (!withdrawal) {
      res.status(404).send({
        message: 'Withdrawal not found',
      });
      return;
    }

    const formattedWithdrawal = withdrawal.toJSON();
    formattedWithdrawal.withdrawalStatusName = formattedWithdrawal.withdrawalStatus.name;
    delete formattedWithdrawal.withdrawalStatus;

    res.json({
      data: formattedWithdrawal,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { hash } = req.body;

    const withdrawal = await db.withdrawal.findOne({
      where: {
        id,
      },
    });

    if (!withdrawal) {
      res.status(404).send({
        message: 'Withdrawal not found',
      });
      return;
    }

    if (withdrawal.withdrawalStatusId !== 1) {
      res.status(404).send({
        message: 'This withdrawal is not available',
      });
      return;
    }

    // TODO: Need to provide transaction hash too
    await withdrawal.update({
      withdrawalStatusId: 2,
      hash,
    });

    res.json({
      data: {
        message: 'Approved withdrawal',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.declineWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const withdrawal = await db.withdrawal.findOne({
      where: {
        id,
      },
    });

    if (!withdrawal) {
      res.status(404).send({
        message: 'Withdrawal not found',
      });
      return;
    }

    if (withdrawal.withdrawalStatusId !== 1) {
      res.status(404).send({
        message: 'This withdrawal is not available',
      });
      return;
    }

    await withdrawal.update({
      withdrawalStatusId: 4,
      message,
    });

    res.json({
      data: {
        message: 'Declined withdrawal',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
