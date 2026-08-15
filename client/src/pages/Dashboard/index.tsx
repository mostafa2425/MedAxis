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
import './Dashboard.scss';

// ─── Dashboard Page ────────────────────────────────
export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const greeting = getGreeting();
  const userName = user?.name || '';

  return (
    <div className="dashboard-page page">
      {/* ─── Header ──────────────────────────────── */}
      <div className="pageHeader">
        <div className="headerLeft">
          <h1 className="pageTitle">{t('dashboard.title')}</h1>
          <p className="welcomeMessage">
            {greeting}{userName ? ', ' : ''}
            {userName && (
              <span className="welcomeName">{userName}</span>
            )}
            {!userName && '!'}
          </p>
        </div>
        <div className="headerActions">
          <Button
            icon={<UserAddOutlined />}
            onClick={() => navigate('/patients?add=1')}
          >
            {t('dashboard.addNewPatient')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/operations/new')}
          >
            {t('dashboard.addNewOperation')}
          </Button>
        </div>
      </div>

      {/* ─── Stats Cards ─────────────────────────── */}
      <StatsCards />

      {/* ─── Middle Row: Status Overview + Chart ── */}
      <div className="middleRow">
        <div className="statusCol">
          <StatusOverview />
        </div>
        <div className="chartCol">
          <MonthlyChart />
        </div>
      </div>

      {/* ─── Recent Operations ──────────────────── */}
      <div className="recentSection">
        <RecentOperations />
      </div>
    </div>
  );
}
