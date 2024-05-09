const request = require('supertest');
const { app } = require('../server');

require('dotenv').config();

const api = `/api-admin/${process.env.VERSION}`;

/*
describe('Register by Email XXX2', () => {
  it('Success', async () => {
    const body = {
      email: 'incrxi-test-400@gmail.com',
      password: 'xxxxxx',
      passwordConfirm: 'xxxxxx',
      verificationCode: '000000',
    };
    const response = await request(app).post(`${api}/register/email`).send(body);
    expect(response.statusCode).toBe(200, `Expected statusCode to be 200, but got ${response.statusCode}`);
  });
});
*/

describe(`POST ${api}/media/files`, () => {
  it('Should upload files and return file data', async () => {
    const response = await request(app)
      .post(`${api}/media/files`)
      .attach('files', './test/files/cute_01.jpg');

    console.log(response);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(2);
  });

  // it('should handle no files uploaded', async () => {
  //   const response = await request(app)
  //     .post('/files');

  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe('No files to upload');
  // });

  // it('should handle server errors', async () => {
  //   // Mock gcs.upload to throw an error
  //   jest.mock('../path/to/your/gcs-module', () => ({
  //     upload: jest.fn().mockRejectedValue(new Error('Simulated failure'))
  //   }));

  //   const response = await request(app)
  //     .post('/files')
  //     .attach('files', 'path/to/your/test/file.jpg');

  //   expect(response.status).toBe(500);
  //   expect(response.body.message).toBe('Some error occurred');
  // });
});
