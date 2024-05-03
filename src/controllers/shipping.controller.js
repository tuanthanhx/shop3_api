const db = require('../models');

exports.getServices = async (req, res) => {
  try {
    const data = await db.logistics_service.findAll({
      where: { isEnabled: true },
      attributes: ['id', 'name', 'description'],
      include: [
        {
          model: db.logistics_provider,
          as: 'logisticsProviders',
          attributes: ['id', 'name', 'description', 'logo'],
          where: { isEnabled: true },
          through: {
            attributes: [],
          },
          include: [
            {
              model: db.logistics_provider_option,
              as: 'logisticsProvidersOptions',
              attributes: ['packageWeightMin', 'packageWeightMax', 'packageWidthMax', 'packageHeightMax', 'packageLengthMax', 'codSupported', 'cpSupported'],
              where: {
                logisticsServiceId: { [db.Sequelize.Op.col]: 'logistics_service.id' },
              },
            },
          ],
        },
      ],
    });
    res.send({
      data,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred',
    });
  }
};
