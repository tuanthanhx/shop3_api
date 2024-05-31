const { ethers } = require('ethers');
const logger = require('../../utils/logger');
const db = require('../../models');

exports.connectWallet = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const {
      address,
      signature,
      message,
    } = req.body;
    const signerAddress = ethers.verifyMessage(message, signature);

    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const duplicate = await db.user.findOne({
      where: { walletAddress: signerAddress },
    });

    if (duplicate) {
      res.status(400).json({ error: 'This wallet address is already used by other user' });
      return;
    }

    const me = await db.user.findByPk(userId);

    if (!me) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    me.update({
      walletAddress: signerAddress,
    });

    res.json({
      data: {
        message: 'Wallet connected successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.disconnectWallet = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const me = await db.user.findByPk(userId);

    if (!me) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!me.email && !me.phone) {
      res.status(400).json({ error: 'Cannot disconnect wallet if email and phone are empty' });
      return;
    }

    me.update({
      walletAddress: null,
    });

    res.json({
      data: {
        message: 'Wallet disconnected successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
