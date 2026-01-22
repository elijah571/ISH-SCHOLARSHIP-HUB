import nodemailer from 'nodemailer';

let transporter;

export async function sendEmail(to, subject, html) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error('Email credentials not available');
  }

  const port = Number(SMTP_PORT);

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });

    await transporter.verify();
  }

  await transporter.sendMail({
    from: `"ISH Scholarship Hub" <${EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}
