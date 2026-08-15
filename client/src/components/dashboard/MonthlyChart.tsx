import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Spin, Tooltip } from 'antd';
import { dashboardService } from '@/services/dashboard.service';
import type { MonthlyTrend } from '@/types';
import './MonthlyChart.scss';

// ─── Format month string to short name ───────────────
function formatMonth(monthStr: string): string {
  try {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short' });
  } catch {
    return monthStr;
  }
}

// ─── Single Bar ─────────────────────────────────────
function Bar({
  value,
  max,
  colorClass,
  label,
}: {
  value: number;
  max: number;
  colorClass: string;
  label: string;
}) {
  const heightPercent = max > 0 ? Math.max(2, (value / max) * 100) : 2;

  return (
    <Tooltip title={`${label}: ${value}`} placement="top">
      <div
        className={`bar ${colorClass}`}
        style={{ height: `${heightPercent}%` }}
        data-value={value}
      />
    </Tooltip>
  );
}

// ─── Y-Axis Labels ─────────────────────────────────
function YAxis({ max }: { max: number }) {
  const steps = 4;
  const labels: number[] = [];
  for (let i = steps; i >= 0; i--) {
    labels.push(Math.round((max / steps) * i));
  }

  return (
    <div className="yAxis">
      {labels.map((val, idx) => (
        <span key={idx} className="yAxisLabel">
          {val}
        </span>
      ))}
    </div>
  );
}

// ─── Monthly Chart Component ───────────────────────
export default function MonthlyChart() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'monthlyTrends'],
    queryFn: () => dashboardService.getMonthlyTrends(),
    select: (res) => res.data.data,
  });

  const trends = data ?? [];
  const last6 = trends.slice(-6);

  const maxTotal = Math.max(...last6.map((m) => m.total), 1);

  // Round max up for nicer axis labels
  const niceMax =
    maxTotal <= 5
      ? 5
      : Math.ceil(maxTotal / 5) * 5;

  if (isLoading) {
    return (
      <div className="monthly-chart section">
        <div className="sectionHeader">
          <h3 className="sectionTitle">
            {t('dashboard.monthlyTrends')}
          </h3>
        </div>
        <div className="loadingWrapper">
          <Spin />
        </div>
      </div>
    );
  }

  if (last6.length === 0) {
    return (
      <div className="monthly-chart section">
        <div className="sectionHeader">
          <h3 className="sectionTitle">
            {t('dashboard.monthlyTrends')}
          </h3>
        </div>
        <div className="emptyWrapper">
          <span className="emptyText">{t('common.noData')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="monthly-chart section">
      <div className="sectionHeader">
        <h3 className="sectionTitle">
          {t('dashboard.monthlyTrends')}
        </h3>
        <div className="legend">
          <span className="legendItem">
            <span
              className="legendDot"
              style={{ background: '#2563EB' }}
            />
            {t('common.total')}
          </span>
          <span className="legendItem">
            <span
              className="legendDot"
              style={{ background: '#16A34A' }}
            />
            {t('dashboard.completed')}
          </span>
          <span className="legendItem">
            <span
              className="legendDot"
              style={{ background: '#DC2626' }}
            />
            {t('operations.cancelled')}
          </span>
        </div>
      </div>

      <div className="chartBody">
        <div className="chartRow">
          <YAxis max={niceMax} />
          <div className="chartContainer">
            {last6.map((month: MonthlyTrend) => (
              <div key={month.month} className="barGroup">
                <div className="barsWrapper">
                  <Bar
                    value={month.total}
                    max={niceMax}
                    colorClass={'barTotal'}
                    label={`${formatMonth(month.month)} ${t('common.total').toLowerCase()}`}
                  />
                </div>
                <span className="monthLabel">
                  {formatMonth(month.month)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
