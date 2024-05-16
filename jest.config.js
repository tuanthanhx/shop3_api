module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup/jest.setup.js'],
  globalSetup: './test/setup/global.setup.js',
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test/result',
      filename: 'report.html',
      expand: true,
    }],
  ],
};
