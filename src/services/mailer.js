import nodemailer from 'nodemailer';
import { getEnv } from '../utils/getEnv.js';
import { logger } from '../utils/logger.js';

const host = getEnv('SMTP_HOST', 'smtp-relay.brevo.com');
const port = Number(getEnv('SMTP_PORT', '587'));
const user = getEnv('SMTP_USER');
const pass = getEnv('SMTP_PASSWORD');
export const SMTP_FROM = getEnv('SMTP_FROM');

if (!user || !pass || !SMTP_FROM) {
  throw new Error(
    '[mailer] Missing SMTP_USER, SMTP_PASSWORD, or SMTP_FROM environment variables',
  );
}

const secure = port === 465;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
});

/**
 * Send an email via Brevo SMTP
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.subject
 * @param {string} [params.text]
 * @param {string} [params.html]
 */

export async function sendMail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
    html,
  });

  if (logger?.info) {
    logger.info(
      { to, messageId: info?.messageId },
      '[MAILER] Email sent successfully',
    );
  }
  return info;
}
