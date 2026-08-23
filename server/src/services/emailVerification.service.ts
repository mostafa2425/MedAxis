import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/errors';

const TOKEN_TTL_MINUTES = 30;
const RESEND_COOLDOWN_SECONDS = 60;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function getConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'MedAxis';
  const appUrl = process.env.APP_URL;

  if (!apiKey || !senderEmail || !appUrl) {
    throw new AppError('Email verification is not configured', 503);
  }

  return { apiKey, senderEmail, senderName, appUrl: appUrl.replace(/\/$/, '') };
}

function verificationUrl(appUrl: string, token: string) {
  return `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;
}

function emailHtml(name: string, url: string) {
  const safeName = name.replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[char] || char));
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verify your MedAxis account</title></head><body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 12px"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden"><tr><td style="background:#2563eb;padding:28px;text-align:center;color:#fff;font-size:28px;font-weight:700">MedAxis</td></tr><tr><td style="padding:40px 32px"><div style="width:60px;height:60px;line-height:60px;margin:0 auto 20px;background:#eff6ff;border-radius:50%;text-align:center;font-size:28px">✓</div><h1 style="font-size:26px;text-align:center;margin:0 0 14px">Verify your email</h1><p style="font-size:16px;line-height:25px;color:#475569;text-align:center;margin:0 auto 26px">Hi ${safeName}, please verify your email address to activate your MedAxis account.</p><p style="text-align:center;margin:0 0 26px"><a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700">Verify Email</a></p><div style="background:#f8fafc;border-radius:10px;padding:16px;font-size:12px;line-height:18px;color:#64748b;word-break:break-all">If the button does not work, copy and paste this link into your browser:<br><br>${url}</div><p style="font-size:13px;line-height:20px;color:#64748b;text-align:center;border-top:1px solid #e2e8f0;padding-top:22px;margin-top:24px">This link expires in 30 minutes. If you did not create a MedAxis account, you can safely ignore this email.</p></td></tr><tr><td style="background:#f8fafc;padding:24px;text-align:center;color:#94a3b8;font-size:12px;line-height:18px">MedAxis · Healthcare management made simple.<br>© 2026 MedAxis. All rights reserved.</td></tr></table></td></tr></table></body></html>`;
}

async function sendEmail(to: string, name: string, url: string) {
  const { apiKey, senderEmail, senderName } = getConfig();
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: to, name }],
      subject: 'Verify your MedAxis account',
      htmlContent: emailHtml(name, url),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('Brevo email send failed:', response.status, detail);
    throw new AppError('Unable to send verification email. Please try again later.', 503);
  }
}

export class EmailVerificationService {
  async issue(userId: string, email: string, name: string, enforceCooldown = true) {
    getConfig();
    const latest = await prisma.$queryRaw<Array<{ createdAt: Date }>>`
      SELECT "createdAt" FROM "email_verification_tokens"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC LIMIT 1
    `;

    if (enforceCooldown && latest[0] && Date.now() - new Date(latest[0].createdAt).getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
      throw new AppError('Please wait before requesting another verification email.', 429);
    }

    await prisma.$executeRaw`DELETE FROM "email_verification_tokens" WHERE "userId" = ${userId}`;
    const token = randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.$executeRaw`
      INSERT INTO "email_verification_tokens" ("id", "userId", "tokenHash", "expiresAt", "createdAt")
      VALUES (${randomBytes(16).toString('hex')}, ${userId}, ${tokenHash}, ${expiresAt}, NOW())
    `;

    try {
      await sendEmail(email, name, verificationUrl(getConfig().appUrl, token));
    } catch (error) {
      await prisma.$executeRaw`DELETE FROM "email_verification_tokens" WHERE "tokenHash" = ${tokenHash}`;
      throw error;
    }
  }

  async verify(token: string) {
    if (!token || token.length < 32) throw new AppError('Invalid verification link', 400);
    const tokenHash = hashToken(token);
    const rows = await prisma.$queryRaw<Array<{ id: string; userId: string; expiresAt: Date }>>`
      SELECT "id", "userId", "expiresAt" FROM "email_verification_tokens"
      WHERE "tokenHash" = ${tokenHash} LIMIT 1
    `;
    const record = rows[0];
    if (!record) throw new AppError('This verification link is invalid or has already been used.', 400);
    if (new Date(record.expiresAt).getTime() <= Date.now()) {
      await prisma.$executeRaw`DELETE FROM "email_verification_tokens" WHERE "id" = ${record.id}`;
      throw new AppError('This verification link has expired. Please request a new one.', 400);
    }

    await prisma.$executeRaw`UPDATE "users" SET "emailVerifiedAt" = NOW(), "updatedAt" = NOW() WHERE "id" = ${record.userId}`;
    await prisma.$executeRaw`DELETE FROM "email_verification_tokens" WHERE "id" = ${record.id}`;
    return { verified: true };
  }

  async resend(email: string) {
    const rows = await prisma.$queryRaw<Array<{ id: string; email: string; name: string; emailVerifiedAt: Date | null; isActive: boolean }>>`
      SELECT "id", "email", "name", "emailVerifiedAt", "isActive" FROM "users" WHERE LOWER("email") = LOWER(${email}) LIMIT 1
    `;
    const user = rows[0];
    if (!user || !user.isActive) return;
    if (user.emailVerifiedAt) throw new AppError('Email is already verified. You can log in.', 400);
    await this.issue(user.id, user.email, user.name, true);
  }
}

export const emailVerificationService = new EmailVerificationService();
