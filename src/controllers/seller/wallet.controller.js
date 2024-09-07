const walletService = require('../../services/wallet');
const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const wallet = await db.wallet.findOne({
      where: {
        userId: user.id,
      },
      attributes: ['id', 'address', 'balance'],
      include: [{
        model: db.wallet_type,
        as: 'walletType',
        attributes: ['name', 'unit'],
      }],
    });

    const walletObj = wallet.toJSON();
    walletObj.name = walletObj.walletType.name;
    walletObj.unit = walletObj.walletType.unit;
    delete walletObj.walletType;

    res.send({
      data: walletObj,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.getWithdrawals = async (req, res) => {
  try {
    const { user } = req;
    const {
      page,
      limit,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const wallet = await db.wallet.findOne({
      where: {
        userId: user.id,
      },
      attributes: ['id'],
    });

    const condition = {
      walletId: wallet.id,
    };

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
    const { user } = req;
    const { id } = req.params;

    const wallet = await db.wallet.findOne({
      where: {
        userId: user.id,
      },
      attributes: ['id'],
    });

    const withdrawal = await db.withdrawal.findOne({
      where: {
        id,
        walletId: wallet.id,
      },
      attributes: ['id', 'amount', 'network', 'address', 'memo', 'createdAt', 'updatedAt', 'withdrawalStatusId'],
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

exports.createWithdrawal = async (req, res) => {
  try {
    const { user } = req;

    const {
      network,
      address,
      memo,
      amount,
    } = req.body;

    const wallet = await db.wallet.findOne({
      where: {
        userId: user.id,
      },
    });

    const object = {
      walletId: wallet.id,
      network,
      address,
      memo,
      amount,
      withdrawalStatusId: 1,
    };

    console.log(wallet.balance);
    console.log(amount);
    console.log(wallet.balance < amount);

    if (wallet.balance < amount) {
      res.status(400).send({
        message: 'Your balance is not enough',
      });
      return;
    }

    await walletService.decreaseAmount(wallet.id, amount);

    await db.withdrawal.create(object);

    res.json({
      data: {
        message: 'Created withdrawal successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.cancelWithdrawal = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const wallet = await db.wallet.findOne({
      where: {
        userId: user.id,
      },
      attributes: ['id'],
    });

    const withdrawal = await db.withdrawal.findOne({
      where: {
        id,
        walletId: wallet.id,
      },
    });

    if (!withdrawal) {
      res.status(404).send({
        message: 'Withdrawal not found',
      });
      return;
    }

    await withdrawal.update({
      withdrawalStatusId: 3,
    });

    res.json({
      data: {
        message: 'Canceled withdrawal successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
