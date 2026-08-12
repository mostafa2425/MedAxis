import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Dropdown, Avatar, Tooltip, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app.store';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/helpers';
import styles from './Header.module.scss';

interface HeaderProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'dashboard.title',
  '/patients': 'patients.title',
  '/operations': 'operations.title',
  '/doctors': 'doctors.title',
  '/hospitals': 'hospitals.title',
  '/specialties': 'specialties.title',
  '/search': 'search.title',
  '/settings': 'settings.title',
};

function getPageTitleKey(pathname: string): string {
  if (pathname === '/') return PAGE_TITLES['/'];

  // Match the first segment of the path
  const segments = pathname.split('/').filter(Boolean);
  const basePath = '/' + segments[0];

  if (PAGE_TITLES[basePath]) {
    return PAGE_TITLES[basePath];
  }

  // Handle sub-paths
  if (basePath === '/patients' && segments[1] === 'new') return 'patients.newPatient';
  if (basePath === '/operations' && segments[1] === 'new') return 'operations.addOperation';

  return 'dashboard.title';
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const darkMode = useAppStore((s) => s.darkMode);
  const language = useAppStore((s) => s.language);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const toggleLanguage = useAppStore((s) => s.toggleLanguage);

  const pageTitleKey = useMemo(() => getPageTitleKey(location.pathname), [location.pathname]);

  const userMenuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: t('layout.profile'),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: t('layout.settings'),
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: t('auth.logout'),
        danger: true,
      },
    ],
    [t]
  );

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login', { replace: true });
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <header className={`${styles.header} ${collapsed ? styles.headerCollapsed : ''}`}>
      {/* ─── Left Section ──────────────────────────── */}
      <div className={styles.headerLeft}>
        <button
          className={styles.menuTrigger}
          onClick={onMenuClick}
          type="button"
          aria-label="Toggle menu"
        >
          <MenuOutlined />
        </button>

        <h1 className={styles.pageTitle}>{t(pageTitleKey)}</h1>
      </div>

      {/* ─── Right Section ─────────────────────────── */}
      <div className={styles.headerRight}>
        <Space size={4}>
          {/* Language Toggle */}
          <Tooltip title={language === 'en' ? t('layout.arabic') : t('layout.english')}>
            <Button
              type="text"
              className={styles.iconBtn}
              icon={<GlobalOutlined />}
              onClick={toggleLanguage}
              aria-label={t('layout.language')}
            />
          </Tooltip>

          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? t('settings.lightMode') : t('settings.darkMode')}>
            <Button
              type="text"
              className={styles.iconBtn}
              icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleDarkMode}
              aria-label={t('layout.darkMode')}
            />
          </Tooltip>

          {/* User Avatar Dropdown */}
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            trigger={['click']}
            placement="bottomRight"
          >
            <button className={styles.avatarBtn} type="button">
              <Avatar
                size={36}
                src={user?.avatarUrl || undefined}
                style={{
                  backgroundColor: user?.avatarUrl ? undefined : '#2563EB',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {user ? getInitials(user.name) : '?'}
              </Avatar>
              <span className={styles.userName}>
                {user?.name}
              </span>
            </button>
          </Dropdown>
        </Space>
      </div>
    </header>
  );
}
