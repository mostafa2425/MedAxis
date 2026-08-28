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

// MedAxis scheduled briefs are intentionally based on Egypt local calendar days.
// Egypt is UTC+3 for the current production schedule.
function egyptDayBounds(offsetDays: number) {
  const now = new Date();
  const egyptNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const start = new Date(
    Date.UTC(
      egyptNow.getUTCFullYear(),
      egyptNow.getUTCMonth(),
      egyptNow.getUTCDate() + offsetDays,
      -3,
      0,
      0,
      0,
    ),
  );
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

function compactOperationDetails(
  brief: Awaited<ReturnType<typeof assistantService.getBrief>>,
  max = 3,
) {
  const operations = brief.operations.slice(0, max).map((operation) => {
    const time = operation.operationTime?.trim() ? ` ${operation.operationTime}` : '';
    return `${operation.name}${time}`;
  });

  const remaining = Math.max(brief.operations.length - operations.length, 0);
  if (remaining > 0) operations.push(`+${remaining} more`);

  return operations;
}

export class NotificationService {
  async list(userId: string, limit = 30) {
    return prisma.$queryRawUnsafe<StoredNotification[]>(
      `select id, kind, title, message, priority, scheduled_for, read_at, created_at
       from public.smart_notifications where user_id = $1::uuid
       order by created_at desc limit $2`, userId, Math.min(Math.max(limit, 1), 100),
    );
  }

  async markRead(userId: string, notificationId: string) {
    await prisma.$executeRawUnsafe(
      `update public.smart_notifications set read_at = now() where id = $1::uuid and user_id = $2::uuid`,
      notificationId,
      userId,
    );
  }

  async createTest(userId: string) {
    const scheduledFor = new Date();
    const title = 'MedAxis test notification';
    const message = 'Notifications are working. This is a test notification from MedAxis.';
    const inserted = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `insert into public.smart_notifications (user_id, kind, title, message, priority, scheduled_for)
       values ($1::uuid, 'DAILY_BRIEF', $2, $3, 'normal', $4) returning id`,
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
    return { id: notificationId, title, message, push };
  }

  private async createBrief(
    userId: string,
    kind: NotificationKind,
    scheduledFor: Date,
    start: Date,
    end: Date,
  ) {
    const type = kind === 'DAILY_BRIEF' ? 'daily' : 'weekly';
    const brief = await assistantService.getBrief(userId, type, start.toISOString(), end.toISOString());
    const isDaily = kind === 'DAILY_BRIEF';
    const operationDetails = compactOperationDetails(brief);
    const operationLine = operationDetails.length
      ? `📋 ${operationDetails.join(' · ')}`
      : '📋 No operations scheduled';

    const summary = [
      `👥 ${brief.summary.followUps} follow-up${brief.summary.followUps === 1 ? '' : 's'}`,
      `⚠️ ${brief.summary.overdueFollowUps} overdue`,
      `🔎 ${brief.summary.attention} need attention`,
      `💰 ${brief.summary.paymentDue} payment${brief.summary.paymentDue === 1 ? '' : 's'} · EGP ${brief.summary.outstandingAmount.toLocaleString('en-EG')}`,
    ].join(' · ');

    const message = isDaily
      ? [
          `📅 ${brief.summary.operations} operation${brief.summary.operations === 1 ? '' : 's'} tomorrow.`,
          operationLine,
          summary,
        ].join(' ')
      : [
          `📅 ${brief.summary.operations} operation${brief.summary.operations === 1 ? '' : 's'} in the next 7 days.`,
          operationLine,
          summary,
        ].join(' ');

    const priority = brief.summary.attention > 0 ? 'important' : 'normal';
    const title = isDaily ? "🩺 Tomorrow's Practice Brief" : '📊 Weekly Practice Brief';

    const inserted = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `insert into public.smart_notifications (user_id, kind, title, message, priority, scheduled_for)
       values ($1::uuid, $2, $3, $4, $5, $6)
       on conflict (user_id, kind, scheduled_for) do nothing returning id`,
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

  // Runs at 21:00 Egypt time and reports tomorrow's operations/follow-ups.
  async processDaily() {
    const { start, end } = egyptDayBounds(1);
    const scheduledFor = start;
    const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    for (const user of users) await this.createBrief(user.id, 'DAILY_BRIEF', scheduledFor, start, end);
    return { processed: users.length, kind: 'daily' as const, range: { start, end } };
  }

  // Runs at 21:00 Egypt time every Friday and reports the next 7 days.
  async processWeekly() {
    const { start } = egyptDayBounds(1);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const scheduledFor = start;
    const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    for (const user of users) await this.createBrief(user.id, 'WEEKLY_BRIEF', scheduledFor, start, end);
    return { processed: users.length, kind: 'weekly' as const, range: { start, end } };
  }
}

export const notificationService = new NotificationService();
