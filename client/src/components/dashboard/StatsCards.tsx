import { Row, Col, Card, Skeleton, Tooltip, Typography } from 'antd';
import {
  TeamOutlined,
  ScissorOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  BankOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency } from '@/utils/helpers';
import type { DashboardStats } from '@/types';
import './StatsCards.scss';

type MetricKey =
  | 'totalOperations'
  | 'completedOperations'
  | 'pendingOperations'
  | 'totalPatients'
  | 'totalDoctors'
  | 'totalNurses'
  | 'totalHospitals'
  | 'revenue';

interface MetricConfig {
  key: MetricKey;
  icon: React.ReactNode;
  labelKey: string;
  iconBg: string;
  iconColor: string;
  resolve: (stats: DashboardStats) => { available: boolean; display: string; reason?: string };
}

export default function StatsCards() {
  const { t } = useTranslation();
  const currency = t('common.currency');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    select: (res) => res.data.data,
  });

  const metrics: MetricConfig[] = [
    {
      key: 'totalOperations',
      icon: <ScissorOutlined />,
      labelKey: 'dashboard.totalOperations',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      resolve: (s) => ({ available: typeof s.totalOperations === 'number', display: String(s.totalOperations ?? '') }),
    },
    {
      key: 'completedOperations',
      icon: <CheckCircleOutlined />,
      labelKey: 'dashboard.completedOperations',
      iconBg: '#F0FDFA',
      iconColor: '#14B8A6',
      resolve: (s) => ({ available: typeof s.completedOperations === 'number', display: String(s.completedOperations ?? '') }),
    },
    {
      key: 'pendingOperations',
      icon: <ClockCircleOutlined />,
      labelKey: 'dashboard.pendingOperations',
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      resolve: (s) => ({ available: typeof s.pendingOperations === 'number', display: String(s.pendingOperations ?? '') }),
    },
    {
      key: 'totalPatients',
      icon: <TeamOutlined />,
      labelKey: 'dashboard.totalPatients',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      resolve: (s) => ({ available: typeof s.totalPatients === 'number', display: String(s.totalPatients ?? '') }),
    },
    {
      key: 'totalDoctors',
      icon: <UserOutlined />,
      labelKey: 'dashboard.doctors',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      resolve: (s) => ({ available: typeof s.totalDoctors === 'number', display: String(s.totalDoctors ?? '') }),
    },
    {
      key: 'totalNurses',
      icon: <MedicineBoxOutlined />,
      labelKey: 'dashboard.nurses',
      iconBg: '#FDF2F8',
      iconColor: '#DB2777',
      resolve: (s) => ({ available: typeof s.totalNurses === 'number', display: String(s.totalNurses ?? '') }),
    },
    {
      key: 'totalHospitals',
      icon: <BankOutlined />,
      labelKey: 'dashboard.hospitals',
      iconBg: '#EEF2FF',
      iconColor: '#4F46E5',
      resolve: (s) => ({ available: typeof s.totalHospitals === 'number', display: String(s.totalHospitals ?? '') }),
    },
    {
      key: 'revenue',
      icon: <DollarOutlined />,
      labelKey: 'dashboard.totalRevenue',
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      resolve: (s) => {
        if (s.revenue && typeof s.revenue.totalCost === 'number') {
          return { available: true, display: formatCurrency(s.revenue.totalCost, currency) };
        }
        return {
          available: false,
          display: t('dashboard.notAvailable'),
          reason: t('dashboard.dataUnavailableTooltip'),
        };
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="stats-cards">
        <Row gutter={[12, 12]}>
          {metrics.map((metric) => (
            <Col key={metric.key} xs={12} sm={12} xl={6}>
              <Card bordered={false} className="loadingCard">
                <Skeleton active paragraph={false} title={{ width: '70%' }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="stats-cards">
      <Row gutter={[12, 12]}>
        {metrics.map((metric) => {
          const resolved = stats
            ? metric.resolve(stats)
            : { available: false, display: t('dashboard.notAvailable'), reason: t('dashboard.dataUnavailableTooltip') };
          const valueNode = (
            <Typography.Text strong style={{ fontSize: 22 }}>
              {resolved.available ? resolved.display : t('dashboard.notAvailable')}
            </Typography.Text>
          );

          return (
            <Col key={metric.key} xs={12} sm={12} xl={6}>
              <Card className="card" bordered={false} styles={{ body: { padding: 0 } }}>
                <div className="inner">
                  <div className="icon" style={{ backgroundColor: metric.iconBg, color: metric.iconColor }}>
                    {metric.icon}
                  </div>
                  <div className="content">
                    <span className="label">{t(metric.labelKey)}</span>
                    {resolved.available ? (
                      valueNode
                    ) : (
                      <Tooltip title={resolved.reason ?? t('dashboard.dataUnavailableTooltip')}>
                        <span>
                          {valueNode}
                          <Typography.Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                            {t('dashboard.dataNotAvailable')}
                          </Typography.Text>
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
