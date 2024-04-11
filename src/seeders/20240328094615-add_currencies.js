module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('currencies', [
      {
        name: 'U.S. dollar',
        code: 'USD',
        symbol: '$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Euro',
        code: 'EUR',
        symbol: '€',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Japanese yen',
        code: 'JPY',
        symbol: '¥',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pound sterling',
        code: 'GBP',
        symbol: '£',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Renminbi',
        code: 'CNY',
        symbol: '¥',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Australian dollar',
        code: 'AUD',
        symbol: 'A$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Canadian dollar',
        code: 'CAD',
        symbol: 'C$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Swiss franc',
        code: 'CHF',
        symbol: 'CHF',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hong Kong dollar',
        code: 'HKD',
        symbol: 'HK$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Singapore dollar',
        code: 'SGD',
        symbol: 'S$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Swedish krona',
        code: 'SEK',
        symbol: 'kr',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'South Korean won',
        code: 'KRW',
        symbol: '₩',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Norwegian krone',
        code: 'NOK',
        symbol: 'kr',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'New Zealand dollar',
        code: 'NZD',
        symbol: 'NZ$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Indian rupee',
        code: 'INR',
        symbol: '₹',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mexican peso',
        code: 'MXN',
        symbol: 'MX$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'New Taiwan dollar',
        code: 'TWD',
        symbol: 'NT$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'South African rand',
        code: 'ZAR',
        symbol: 'R',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Brazilian real',
        code: 'BRL',
        symbol: 'R$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Danish krone',
        code: 'DKK',
        symbol: 'kr',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Polish złoty',
        code: 'PLN',
        symbol: 'zł',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Thai baht',
        code: 'THB',
        symbol: '฿',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Israeli new shekel',
        code: 'ILS',
        symbol: '₪',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Indonesian rupiah',
        code: 'IDR',
        symbol: 'Rp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Czech koruna',
        code: 'CZK',
        symbol: 'Kč',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'United Arab Emirates dirham|UAE dirham',
        code: 'AED',
        symbol: 'د.إ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Turkish lira',
        code: 'TRY',
        symbol: '₺',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hungarian forint',
        code: 'HUF',
        symbol: 'Ft',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Chilean peso',
        code: 'CLP',
        symbol: 'CLP$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Saudi riyal',
        code: 'SAR',
        symbol: '﷼',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Philippine peso',
        code: 'PHP',
        symbol: '₱',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Malaysian ringgit',
        code: 'MYR',
        symbol: 'RM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Colombian peso',
        code: 'COP',
        symbol: 'COL$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Russian ruble',
        code: 'RUB',
        symbol: '₽',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Romanian leu',
        code: 'RON',
        symbol: 'L',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Peruvian sol',
        code: 'PEN',
        symbol: 'S/',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bahraini dinar',
        code: 'BHD',
        symbol: '.د.ب',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bulgarian lev',
        code: 'BGN',
        symbol: 'BGN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Argentine peso',
        code: 'ARS',
        symbol: 'ARG$',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
    await queryInterface.sequelize.query('ALTER TABLE currencies AUTO_INCREMENT = 1;');
  },
};
