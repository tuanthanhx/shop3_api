const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const path = require('path');
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

exports.sendOtpEmail = async (to, otp) => {
  const templatePath = path.join(__dirname, '../templates/email_otp.html');
  const htmlContent = await fs.readFile(templatePath, 'utf8');
  const customizedHtmlContent = htmlContent.replace('{otp}', otp);

  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    subject: `Your OTP Code is ${otp}`,
    html: customizedHtmlContent,
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
