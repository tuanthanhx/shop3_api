const shopService = require('../../services/shop');
const logger = require('../../utils/logger');
const db = require('../../models');

exports.index = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;

    const shop = await shopService.findByUser(userId);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const warehouses = await db.warehouse.findAll({
      where: {
        shopId: shop.id,
      },
      attributes: ['id', 'firstName', 'lastName', 'phone', 'zipCode', 'state', 'city', 'district', 'street', 'address', 'isDefault'],
      include: [
        {
          model: db.country,
          as: 'country',
          attributes: ['code', 'name'],
        },
      ],
    });
    res.send({
      data: warehouses,
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

    const {
      firstName,
      lastName,
      phone,
      countryCode,
      zipCode,
      state,
      city,
      district,
      street,
      address,
      isDefault,
    } = req.body;

    const shop = await shopService.findByUser(userId);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const country = await db.country.findOne({
      where: {
        code: countryCode,
      },
    });

    if (!country) {
      res.status(400).send({
        message: 'countryCode is not valid',
      });
      return;
    }

    const object = {
      shopId: shop.id,
      firstName,
      lastName,
      phone,
      countryCode,
      zipCode,
      state,
      city,
      district,
      street,
      address,
      isDefault,
    };

    const warehouse = await db.warehouse.create(object);

    if (isDefault) {
      await db.warehouse.update(
        { isDefault: false },
        {
          where: {
            shopId: shop.id,
            id: { [db.Sequelize.Op.ne]: warehouse.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Warehouse created successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const { user } = req;
    const userId = user.id;

    const {
      firstName,
      lastName,
      phone,
      countryCode,
      zipCode,
      state,
      city,
      district,
      street,
      address,
      isDefault,
    } = req.body;

    const shop = await shopService.findByUser(userId);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const warehouse = await db.warehouse.findOne({
      where: {
        id,
        shopId: shop.id,
      },
    });

    if (!warehouse) {
      res.status(404).send({
        message: 'Warehouse not found',
      });
      return;
    }

    const country = await db.country.findOne({
      where: {
        code: countryCode,
      },
    });

    if (!country) {
      res.status(400).send({
        message: 'countryCode is not valid',
      });
      return;
    }

    const object = {
      firstName,
      lastName,
      phone,
      countryCode,
      zipCode,
      state,
      city,
      district,
      street,
      address,
      isDefault,
    };

    await warehouse.update(object);

    if (isDefault) {
      await db.warehouse.update(
        { isDefault: false },
        {
          where: {
            shopId: shop.id,
            id: { [db.Sequelize.Op.ne]: warehouse.id },
          },
        },
      );
    }

    res.json({
      data: {
        message: 'Warehouse updated successfully',
      },
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

    const shop = await shopService.findByUser(userId);
    if (!shop) {
      res.status(404).send({
        message: 'Shop not found',
      });
      return;
    }

    const warehouse = await db.warehouse.findOne({
      where: {
        id,
        shopId: shop.id,
      },
    });

    if (!warehouse) {
      res.status(404).send({
        message: 'Warehouse not found',
      });
      return;
    }

    // TODO: Check if the warehouse is in use or not before deleting

    await warehouse.destroy();

    res.json({
      data: {
        message: 'Warehouse deleted successfully',
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
