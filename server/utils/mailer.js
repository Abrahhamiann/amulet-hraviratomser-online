import nodemailer from 'nodemailer';

const envValue = (key) => {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : value;
};

export const getMailTransporter = () => {
  const host = envValue('SMTP_HOST') || 'smtp.gmail.com';
  const port = Number(envValue('SMTP_PORT') || 465);
  const secure = String(envValue('SMTP_SECURE') || 'true') === 'true';
  const user = envValue('SMTP_USER');
  const rawPass = envValue('SMTP_PASS');
  const pass = host.includes('gmail.com') && rawPass ? rawPass.replace(/\s+/g, '') : rawPass;

  if (!user || !pass) {
    throw new Error('Email SMTP credentials are missing');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

export const sendMail = async ({ to, subject, html, text, replyTo }) => {
  const user = envValue('SMTP_USER');
  const from = envValue('AMULET_EMAIL_FROM') || `Amulet <${user}>`;
  const transporter = getMailTransporter();

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
    replyTo
  });
};

export const emailShell = ({ title, intro, body, footer = 'Amulet' }) => `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:28px;border:1px solid #ead9bf;border-radius:18px;color:#17202b;background:#fffdf9">
    <h1 style="margin:0 0 8px;color:#d8b98e;font-family:Georgia,serif;font-size:34px">Amulet</h1>
    <h2 style="margin:12px 0 10px;font-size:24px;color:#17202b">${title}</h2>
    ${intro ? `<p style="font-size:15px;line-height:1.7;color:#657083">${intro}</p>` : ''}
    <div style="margin:22px 0;padding:18px;border-radius:14px;background:#f8f2ea;color:#17202b;font-size:15px;line-height:1.8">${body}</div>
    <p style="margin-top:20px;font-size:13px;color:#8a7864">${footer}</p>
  </div>
`;
