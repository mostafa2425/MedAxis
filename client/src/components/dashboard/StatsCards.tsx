import { Row, Col, Statistic, Card, Spin } from 'antd';
import {
  TeamOutlined,
  ScissorOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '@/services/dashboard.service';
import { useEffect, useRef, useState } from 'react';

// ─── Animated Number Counter ────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const duration = 800;
    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValue + (value - startValue) * eased));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

// ─── Stat Card Config ───────────────────────────────
interface StatCardConfig {
  key: string;
  icon: React.ReactNode;
  labelKey: string;
  valueKey: keyof {
    totalPatients: number;
    totalOperations: number;
    operationsThisMonth: number;
    completedOperations: number;
  };
  iconBg: string;
  iconColor: string;
}

const STAT_CARDS: StatCardConfig[] = [
  {
    key: 'totalPatients',
    icon: <TeamOutlined />,
    labelKey: 'dashboard.totalPatients',
    valueKey: 'totalPatients',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
  },
  {
    key: 'totalOperations',
    icon: <ScissorOutlined />,
    labelKey: 'dashboard.totalOperations',
    valueKey: 'totalOperations',
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
  },
  {
    key: 'operationsThisMonth',
    icon: <CalendarOutlined />,
    labelKey: 'dashboard.operationsThisMonth',
    valueKey: 'operationsThisMonth',
    iconBg: '#FAF5FF',
    iconColor: '#7C3AED',
  },
  {
    key: 'completedOperations',
    icon: <CheckCircleOutlined />,
    labelKey: 'dashboard.completedOperations',
    valueKey: 'completedOperations',
    iconBg: '#F0FDFA',
    iconColor: '#14B8A6',
  },
];

// ─── Single Stat Card ───────────────────────────────
function StatCard({ config, value }: { config: StatCardConfig; value: number }) {
  const { t } = useTranslation();

  return (
    <Card
      className="stat-card"
      bordered={false}
      styles={{ body: { padding: 20 } }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: config.iconBg,
            color: config.iconColor,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <span
            style={{
              fontSize: 14,
              color: '#94A3B8',
              fontWeight: 500,
            }}
          >
            {t(config.labelKey)}
          </span>
          <Statistic
            value={value}
            formatter={() => <AnimatedNumber value={value} />}
            valueStyle={{
              fontSize: 24,
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.1,
            }}
          />
        </div>
      </div>
    </Card>
  );
}

// ─── Stats Cards Grid ───────────────────────────────
export default function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    select: (res) => res.data.data,
  });

  const stats = data ?? {
    totalPatients: 0,
    totalOperations: 0,
    operationsThisMonth: 0,
    completedOperations: 0,
  };

  if (isLoading) {
    return (
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col key={i} xs={24} sm={12} xl={6}>
            <Card
              bordered={false}
              styles={{ body: { padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 96 } }}
            >
              <Spin />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {STAT_CARDS.map((card) => (
        <Col key={card.key} xs={24} sm={12} xl={6}>
          <StatCard
            config={card}
            value={stats[card.valueKey] as number}
          />
        </Col>
      ))}
    </Row>
  );
}
