import { prisma } from '../utils/prisma';
import { assistantService } from './assistant.service';
import { pushService } from './push.service';

export type NotificationKind = 'DAILY_BRIEF' | 'WEEKLY_BRIEF';

interface StoredNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  priority: string;
  scheduled_for: string;
  read_at: string | null;
  created_at: string;
}

function egyptDayBounds(offsetDays: number) {
  const now = new Date();
  const egyptNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const start = new Date(Date.UTC(egyptNow.getUTCFullYear(), egyptNow.getUTCMonth(), egyptNow.getUTCDate() + offsetDays, -3, 0, 0, 0));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export class NotificationService {
  async list(userId: string, limit = 30) {
    return prisma.$queryRawUnsafe<StoredNotification[]>(
      `select id, kind, title, message, priority, scheduled_for, read_at, created_at
       from public.smart_notifications
       where user_id = $1::uuid
       order by created_at desc
       limit $2`,
      userId,
      Math.min(Math.max(limit, 1), 100),
    );
  }

  async markRead(userId: string, notificationId: string) {
    await prisma.$executeRawUnsafe(
      `update public.smart_notifications set read_at = now()
       where id = $1::uuid and user_id = $2::uuid`,
      notificationId,
      userId,
    );
  }

  async createTest(userId: string) {
    const scheduledFor = new Date();
    const title = 'MedAxis test notification';
    const message = 'Notifications are working. This is a test notification from MedAxis.';

    const inserted = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `insert into public.smart_notifications
        (user_id, kind, title, message, priority, scheduled_for)
       values ($1::uuid, 'DAILY_BRIEF', $2, $3, 'normal', $4)
       returning id`,
      userId,
      title,
      message,
      scheduledFor,
    );

    const notificationId = inserted[0]?.id;
    if (!notificationId) throw new Error('Failed to create test notification');

    const push = await pushService.sendToUser(userId, {
      title,
      body: message,
      url: '/assistant',
      tag: 'MEDAXIS_TEST_NOTIFICATION',
      kind: 'TEST_NOTIFICATION',
      notificationId,
    });

    return {
      id: notificationId,
      title,
      message,
      push,
    };
  }

  private async createBrief(userId: string, kind: NotificationKind, scheduledFor: Date, start: Date, end: Date) {
    const type = kind === 'DAILY_BRIEF' ? 'daily' : 'weekly';
    const brief = await assistantService.getBrief(userId, type, start.toISOString(), end.toISOString());
    const prefix = kind === 'DAILY_BRIEF' ? 'Tomorrow' : 'Next week';
    const message = `${prefix}: ${brief.summary.operations} operations · ${brief.summary.followUps} follow-ups · ${brief.summary.attention} items need attention`;
    const priority = brief.summary.attention > 0 ? 'important' : 'normal';
    const title = kind === 'DAILY_BRIEF' ? 'Your MedAxis brief' : 'Your Week Ahead';

    const inserted = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `insert into public.smart_notifications
        (user_id, kind, title, message, priority, scheduled_for)
       values ($1::uuid, $2, $3, $4, $5, $6)
       on conflict (user_id, kind, scheduled_for) do nothing
       returning id`,
      userId,
      kind,
      title,
      message,
      priority,
      scheduledFor,
    );

    if (inserted[0]?.id) {
      await pushService.sendToUser(userId, {
        title,
        body: message,
        url: '/assistant',
        tag: kind,
        kind,
        notificationId: inserted[0].id,
      });
    }

    return brief;
  }

  async processDaily() {
    const { start, end } = egyptDayBounds(1);
    const scheduledFor = new Date(start.getTime() - 3 * 60 * 60 * 1000);
    const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    for (const user of users) await this.createBrief(user.id, 'DAILY_BRIEF', scheduledFor, start, end);
    return { processed: users.length, kind: 'daily' as const };
  }

  async processWeekly() {
    const today = egyptDayBounds(0).start;
    const day = new Date(today.getTime() + 3 * 60 * 60 * 1000).getUTCDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    const start = new Date(today.getTime() + (daysUntilSaturday + 1) * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const scheduledFor = today;
    const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    for (const user of users) await this.createBrief(user.id, 'WEEKLY_BRIEF', scheduledFor, start, end);
    return { processed: users.length, kind: 'weekly' as const };
  }
}

export const notificationService = new NotificationService();
