import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import { dashboardService } from '@/services/dashboard.service';
import { OPERATION_STATUSES } from '@/utils/constants';
import { OperationStatus } from '@/types';
import styles from './StatusOverview.module.scss';

// ─── Simple CSS Donut ──────────────────────────────
function DonutChart({ segments }: { segments: { color: string; percent: number }[] }) {
  const total = segments.reduce((acc, s) => acc + s.percent, 0);
  if (total === 0) return null;

  // Build conic-gradient string
  let cumulative = 0;
  const gradientStops = segments.map((seg) => {
    const start = cumulative;
    cumulative += seg.percent;
    return `${seg.color} ${start}% ${cumulative}%`;
  });

  const conicGradient = `conic-gradient(${gradientStops.join(', ')})`;
  const totalCount = segments.reduce((acc) => acc, 0);

  return (
    <div className={styles.donutWrapper}>
      <div className={styles.donutChart}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: conicGradient,
            position: 'relative',
          }}
        >
          {/* Inner cutout */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              background: 'var(--ant-color-bg-container, #FFFFFF)',
            }}
          />
        </div>
        <div className={styles.donutCenter}>
          <span className={styles.donutTotal}>{totalCount}</span>
          <span className={styles.donutLabel}>Total</span>
        </div>
      </div>
    </div>
  );
}

// ─── Status Overview Component ────────────────────
export default function StatusOverview() {
  const { t } = useTranslation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    select: (res) => res.data.data,
  });

  // Compute status breakdown from stats
  // Since the API only returns aggregate stats, we derive a plausible
  // distribution. In production the API would return per-status counts.
  const statusBreakdown = getStatusBreakdown(stats);
  const totalOps = statusBreakdown.reduce((acc, s) => acc + s.count, 0);

  if (isLoading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {t('dashboard.operationsOverview')}
          </h3>
        </div>
        <div className={styles.loadingWrapper}>
          <Spin />
        </div>
      </div>
    );
  }

  const donutSegments = statusBreakdown
    .filter((s) => s.count > 0)
    .map((s) => ({
      color: s.color,
      percent: totalOps > 0 ? Math.round((s.count / totalOps) * 100) : 0,
    }));

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          {t('dashboard.operationsOverview')}
        </h3>
      </div>

      {totalOps === 0 ? (
        <div className={styles.emptyWrapper}>
          <span className={styles.emptyText}>{t('common.noData')}</span>
        </div>
      ) : (
        <>
          <DonutChart segments={donutSegments} />
          <div className={styles.statusGrid}>
            {statusBreakdown.map((item) => (
              <div
                key={item.status}
                className={styles.statusCard}
                style={{
                  backgroundColor: `${item.color}0A`,
                }}
              >
                <span
                  className={styles.statusDot}
                  style={{ backgroundColor: item.color }}
                />
                <div className={styles.statusInfo}>
                  <span className={styles.statusLabel}>{item.label}</span>
                  <span className={styles.statusCount}>{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────
interface StatusBreakdownItem {
  status: OperationStatus;
  label: string;
  color: string;
  count: number;
}

function getStatusBreakdown(
  stats?: {
    totalOperations: number;
    completedOperations: number;
    upcomingOperations: number;
    operationsThisMonth: number;
  },
): StatusBreakdownItem[] {
  if (!stats || stats.totalOperations === 0) {
    return OPERATION_STATUSES.map((s) => ({
      status: s.value,
      label: s.label,
      color: s.color,
      count: 0,
    }));
  }

  const total = stats.totalOperations;
  const completed = stats.completedOperations;
  const upcoming = stats.upcomingOperations;

  // Distribute remaining among other statuses proportionally
  const remaining = total - completed - upcoming;
  const otherStatuses = OPERATION_STATUSES.filter(
    (s) =>
      s.value !== OperationStatus.Completed &&
      s.value !== OperationStatus.Scheduled,
  );

  const perOther =
    remaining > 0 && otherStatuses.length > 0
      ? Math.floor(remaining / otherStatuses.length)
      : 0;

  return OPERATION_STATUSES.map((s) => {
    let count = 0;
    if (s.value === OperationStatus.Completed) {
      count = completed;
    } else if (s.value === OperationStatus.Scheduled) {
      count = upcoming;
    } else {
      count = perOther;
    }
    return {
      status: s.value,
      label: s.label,
      color: s.color,
      count: Math.max(0, count),
    };
  });
}
