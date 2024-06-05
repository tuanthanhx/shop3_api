const sgMail = require('@sendgrid/mail');
const logger = require('./logger');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (to, subject, message) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    subject,
    text: message,
  };

  try {
    const response = await sgMail.send(msg);
    logger.info('Email sent:', response);
  } catch (error) {
    if (error.response) {
      logger.error('Error occurred while sending email:', error.response.body);
    } else {
      logger.error('Error occurred while sending email:', error);
    }
  }
};
