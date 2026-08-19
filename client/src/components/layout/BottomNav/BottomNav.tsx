import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  ScissorOutlined,
  SearchOutlined,
  AppstoreOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './BottomNav.scss';

interface BottomNavItem {
  key: string;
  to: string;
  icon: React.ReactNode;
  labelKey: string;
  match?: (pathname: string) => boolean;
}

const PRIMARY_ITEMS: BottomNavItem[] = [
  {
    key: 'dashboard',
    to: '/',
    icon: <DashboardOutlined />,
    labelKey: 'nav.home',
    match: (pathname) => pathname === '/',
  },
  {
    key: 'patients',
    to: '/patients',
    icon: <TeamOutlined />,
    labelKey: 'nav.patients',
    match: (pathname) => pathname.startsWith('/patients'),
  },
  {
    key: 'operations',
    to: '/operations',
    icon: <ScissorOutlined />,
    labelKey: 'nav.operations',
    match: (pathname) => pathname.startsWith('/operations'),
  },
  {
    key: 'assistant',
    to: '/assistant',
    icon: <RobotOutlined />,
    labelKey: 'nav.assistant',
    match: (pathname) => pathname.startsWith('/assistant'),
  },
];

interface BottomNavProps {
  onMoreClick: () => void;
}

export default function BottomNav({ onMoreClick }: BottomNavProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const moreActive = useMemo(() => {
    const path = location.pathname;
    return (
      path.startsWith('/calendar') ||
      path.startsWith('/doctors') ||
      path.startsWith('/hospitals') ||
      path.startsWith('/specialties') ||
      path.startsWith('/profile') ||
      path.startsWith('/settings')
    );
  }, [location.pathname]);

  return (
    <nav className="bottom-nav-root bottomNav" aria-label={t('nav.dashboard')}>
      <div className="inner">
        {PRIMARY_ITEMS.map((item) => {
          const isActive = item.match
            ? item.match(location.pathname)
            : location.pathname === item.to;

          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/'}
              className={`item ${isActive ? 'itemActive' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          className={`item ${moreActive ? 'itemActive' : ''}`}
          onClick={onMoreClick}
          aria-label={t('nav.more')}
        >
          <span className="icon">
            <AppstoreOutlined />
          </span>
          <span className="label">{t('nav.more')}</span>
        </button>
      </div>
    </nav>
  );
}
