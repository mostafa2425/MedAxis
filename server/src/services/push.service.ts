import webpush from 'web-push';
import { prisma } from '../prisma';

interface VapidConfig { subject: string; public_key: string; private_key: string; }

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  kind?: string;
  notificationId?: string;
}

export class PushService {
  private configured = false;
  private config: VapidConfig | null = null;

  private async getConfig() {
    if (this.config) return this.config;
    const envConfig = process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
      ? {
          subject: process.env.VAPID_SUBJECT || 'mailto:admin@medaxis.app',
          public_key: process.env.VAPID_PUBLIC_KEY,
          private_key: process.env.VAPID_PRIVATE_KEY,
        }
      : null;

    if (envConfig) {
      this.config = envConfig;
    } else {
      const rows = await prisma.$queryRawUnsafe<VapidConfig[]>(
        `select subject, public_key, private_key from public.push_vapid_config where id = true limit 1`,
      );
      this.config = rows[0] || null;
    }

    if (this.config && !this.configured) {
      webpush.setVapidDetails(this.config.subject, this.config.public_key, this.config.private_key);
      this.configured = true;
    }
    return this.config;
  }

  async getPublicKey() {
    const config = await this.getConfig();
    return config?.public_key || null;
  }

  async subscribe(userId: string, subscription: { endpoint: string; keys?: { p256dh?: string; auth?: string }; expirationTime?: number | null }, userAgent?: string) {
    const keys = subscription.keys || {};
    await prisma.$executeRawUnsafe(
      `insert into public.push_subscriptions (user_id, endpoint, p256dh, auth, expiration_time, user_agent, updated_at)
       values ($1::uuid, $2, $3, $4, $5, $6, now())
       on conflict (user_id, endpoint) do update set
         p256dh = excluded.p256dh,
         auth = excluded.auth,
         expiration_time = excluded.expiration_time,
         user_agent = excluded.user_agent,
         updated_at = now()`,
      userId,
      subscription.endpoint,
      keys.p256dh || null,
      keys.auth || null,
      subscription.expirationTime || null,
      userAgent || null,
    );
  }

  async unsubscribe(userId: string, endpoint: string) {
    await prisma.$executeRawUnsafe(
      `delete from public.push_subscriptions where user_id = $1::uuid and endpoint = $2`,
      userId,
      endpoint,
    );
  }

  async sendToUser(userId: string, payload: PushPayload) {
    const config = await this.getConfig();
    if (!config) return { sent: 0, skipped: true, reason: 'VAPID keys are not configured' };

    const subscriptions = await prisma.$queryRawUnsafe<Array<{ id: string; endpoint: string; p256dh: string; auth: string }>>(
      `select id, endpoint, p256dh, auth from public.push_subscriptions where user_id = $1::uuid`,
      userId,
    );

    let sent = 0;
    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
          JSON.stringify(payload),
          { TTL: 60 * 60 * 24 },
        );
        sent += 1;
      } catch (error: any) {
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await prisma.$executeRawUnsafe(`delete from public.push_subscriptions where id = $1::uuid`, subscription.id);
        }
      }
    }

    return { sent, skipped: false };
  }
}

export const pushService = new PushService();
