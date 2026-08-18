import webpush from 'web-push';
import { prisma } from '../prisma';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:admin@medaxis.app';

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  kind?: string;
  notificationId?: string;
}

export class PushService {
  isConfigured() {
    return Boolean(publicKey && privateKey);
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
    if (!this.isConfigured()) return { sent: 0, skipped: true, reason: 'VAPID keys are not configured' };

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
