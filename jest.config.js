module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test/result',
      filename: 'report.html',
      expand: true,
    }],
  ],
};
