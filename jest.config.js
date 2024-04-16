module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test/result',
      filename: 'report.html',
      expand: true,
    }],
  ],
};
