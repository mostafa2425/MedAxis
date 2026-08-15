import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import { dashboardService } from '@/services/dashboard.service';
import { OPERATION_STATUSES } from '@/utils/constants';
import { OperationStatus } from '@/types';
import './StatusOverview.scss';

function DonutChart({ segments, total }: { segments: { color: string; percent: number }[]; total: number }) {
  if (total === 0) return null;
  let cumulative = 0;
  const gradientStops = segments.map((seg) => {
    const start = cumulative;
    cumulative += seg.percent;
    return `${seg.color} ${start}% ${cumulative}%`;
  });

  return (
    <div className="donutWrapper">
      <div className="donutChart">
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(${gradientStops.join(', ')})`,
            position: 'relative',
          }}
        >
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
        <div className="donutCenter">
          <span className="donutTotal">{total}</span>
        </div>
      </div>
    </div>
  );
}

export default function StatusOverview() {
  const { t } = useTranslation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    select: (res) => res.data.data,
  });

  if (isLoading) {
    return (
      <div className="status-overview section">
        <div className="sectionHeader">
          <h3 className="sectionTitle">{t('dashboard.operationsOverview')}</h3>
        </div>
        <div className="loadingWrapper">
          <Spin />
        </div>
      </div>
    );
  }

  const breakdown = stats?.statusBreakdown ?? {};
  const statusBreakdown = OPERATION_STATUSES.filter((item) =>
    Object.values(OperationStatus).includes(item.value),
  ).map((item) => ({
    status: item.value,
    label: item.label,
    color: item.color,
    count: breakdown[item.value] ?? 0,
  }));
  const totalOps = statusBreakdown.reduce((sum, item) => sum + item.count, 0);

  const donutSegments = statusBreakdown
    .filter((s) => s.count > 0)
    .map((s) => ({
      color: s.color,
      percent: totalOps > 0 ? Math.round((s.count / totalOps) * 100) : 0,
    }));

  return (
    <div className="status-overview section">
      <div className="sectionHeader">
        <h3 className="sectionTitle">{t('dashboard.operationsOverview')}</h3>
      </div>
      {totalOps === 0 ? (
        <div className="emptyWrapper">
          <span className="emptyText">{t('common.noData')}</span>
        </div>
      ) : (
        <>
          <DonutChart segments={donutSegments} total={totalOps} />
          <div className="statusGrid">
            {statusBreakdown.map((item) => (
              <div key={item.status} className="statusCard" style={{ backgroundColor: `${item.color}0A` }}>
                <span className="statusDot" style={{ backgroundColor: item.color }} />
                <div className="statusInfo">
                  <span className="statusLabel">{item.label}</span>
                  <span className="statusCount">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
