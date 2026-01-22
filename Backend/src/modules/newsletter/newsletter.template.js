export const newsletterTemplate = ({ subject, content, email }) => {
  const frontendURL = process.env.APP_URL;

  if (!frontendURL) {
    throw new Error('FRONTEND_URL not configured');
  }

  const unsubscribeLink = `${frontendURL}/unsubscribe?email=${encodeURIComponent(email)}`;

  return `
  <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:24px; border-radius:8px">

      <h2 style="color:#111827;">ISH Scholarship Hub</h2>
      <h3>${subject}</h3>

      <p style="color:#374151;">
        ${content.replace(/\n/g, '<br />')}
      </p>

      <hr />

      <p style="font-size:12px; color:#6b7280;">
        You received this email because you subscribed to ISH Scholarship Hub.
        <br />
        <a href="${unsubscribeLink}">Unsubscribe</a>
      </p>

    </div>
  </div>`;
};
