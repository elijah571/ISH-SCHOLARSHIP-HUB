import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter = null;

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  
  const port = parseInt(SMTP_PORT, 10) || 587;
  const isSecure = port === 465;

  logger.info(`Creating email transporter: ${SMTP_HOST}:${port}, secure: ${isSecure}`);

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: isSecure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export async function sendEmail(to, subject, html) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.warn('Email credentials not configured - skipping email send');
    logger.warn(`SMTP_HOST: ${SMTP_HOST ? 'set' : 'missing'}, SMTP_USER: ${SMTP_USER ? 'set' : 'missing'}, SMTP_PASS: ${SMTP_PASS ? 'set' : 'missing'}`);
    return { success: false, skipped: true, reason: 'Email credentials not configured' };
  }

  try {
    if (!transporter) {
      transporter = createTransporter();
      
      try {
        const verified = await transporter.verify();
        logger.info('Email transporter verified:', verified);
      } catch (verifyErr) {
        logger.error('Email transporter verification failed:', verifyErr.message);
        transporter = null;
        return { success: false, error: 'Email service not available' };
      }
    }

    const result = await transporter.sendMail({
      from: `"ISH Scholarship Hub" <${EMAIL_FROM || SMTP_USER}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent successfully to ${to}. Message ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('Failed to send email to', to, ':', error.message);
    logger.error('Error code:', error.code, ', response:', error.response);
    
    return { success: false, error: error.message, code: error.code };
  }
}
