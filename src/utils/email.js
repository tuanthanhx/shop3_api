const nodemailer = require('nodemailer');
const logger = require('./logger');

require('dotenv').config();

exports.sendEmail = (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAIL_SERVICE,
    auth: {
      user: process.env.NODEMAIL_SENDER,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAIL_SENDER,
    to,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Error occurred while sending email:', error);
    } else {
      logger.info('Email sent:', info.response);
    }
  });
};
