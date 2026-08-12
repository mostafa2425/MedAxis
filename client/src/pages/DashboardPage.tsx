import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { getGreeting } from '@/utils/helpers';
import StatsCards from '@/components/dashboard/StatsCards';
import StatusOverview from '@/components/dashboard/StatusOverview';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import RecentOperations from '@/components/dashboard/RecentOperations';
import styles from './DashboardPage.module.scss';

// ─── Dashboard Page ────────────────────────────────
export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const greeting = getGreeting();
  const userName = user?.name || '';

  return (
    <div className={styles.page}>
      {/* ─── Header ──────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>{t('dashboard.title')}</h1>
          <p className={styles.welcomeMessage}>
            {greeting}{userName ? ', ' : ''}
            {userName && (
              <span className={styles.welcomeName}>{userName}</span>
            )}
            {!userName && '!'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            icon={<UserAddOutlined />}
            onClick={() => navigate('/patients/new')}
            size="large"
          >
            {t('dashboard.addNewPatient')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/operations/new')}
            size="large"
          >
            {t('dashboard.addNewOperation')}
          </Button>
        </div>
      </div>

      {/* ─── Stats Cards ─────────────────────────── */}
      <StatsCards />

      {/* ─── Middle Row: Status Overview + Chart ── */}
      <div className={styles.middleRow}>
        <div className={styles.statusCol}>
          <StatusOverview />
        </div>
        <div className={styles.chartCol}>
          <MonthlyChart />
        </div>
      </div>

      {/* ─── Recent Operations ──────────────────── */}
      <div className={styles.recentSection}>
        <RecentOperations />
      </div>
    </div>
  );
}
