import { Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/app.store';
import { getInitials } from '@/utils/helpers';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  BankOutlined,
  AppstoreOutlined,
  SearchOutlined,
  GlobalOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Dropdown, Tooltip, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { key: '/', icon: <DashboardOutlined />, labelKey: 'sidebar.dashboard' },
  { key: '/patients', icon: <UserOutlined />, labelKey: 'sidebar.patients' },
  { key: '/operations', icon: <MedicineBoxOutlined />, labelKey: 'sidebar.operations' },
  { key: '/doctors', icon: <TeamOutlined />, labelKey: 'sidebar.doctors' },
  { key: '/hospitals', icon: <BankOutlined />, labelKey: 'sidebar.hospitals' },
  { key: '/specialties', icon: <AppstoreOutlined />, labelKey: 'sidebar.specialties' },
];

export default function AppLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const darkMode = useAppStore((s) => s.darkMode);
  const language = useAppStore((s) => s.language);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const toggleLanguage = useAppStore((s) => s.toggleLanguage);

  const toggleLanguageHandler = () => {
    toggleLanguage();
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: t('layout.profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    }
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar${sidebarCollapsed ? ' sidebar--collapsed' : ''}`}>
        <div className="sidebar__logo">
          <MedicineBoxOutlined style={{ fontSize: 24, color: '#2563EB' }} />
          {!sidebarCollapsed && (
            <span className="sidebar__logo-text">MedAxis</span>
          )}
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              className={`sidebar__menu-item${window.location.pathname === item.key ? ' sidebar__menu-item--active' : ''}`}
              href={item.key}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.key);
              }}
            >
              <span className="sidebar__menu-item-icon">{item.icon}</span>
              <span className="sidebar__menu-item-text">{t(item.labelKey)}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar__footer">
          <a
            className="sidebar__menu-item"
            href="/search"
            onClick={(e) => {
              e.preventDefault();
              navigate('/search');
            }}
          >
            <span className="sidebar__menu-item-icon"><SearchOutlined /></span>
            <span className="sidebar__menu-item-text">{t('sidebar.dashboard')}</span>
          </a>
        </div>
      </aside>

      <div className="app-content">
        <header className="app-header">
          <div className="app-header__left">
            <button
              className="app-header__trigger"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
            >
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            <div className="app-header__search hide-mobile">
              <a href="/search" onClick={(e) => { e.preventDefault(); navigate('/search'); }}>
                <Button icon={<SearchOutlined />} style={{ borderRadius: 8 }}>
                  {t('search.placeholder')}
                </Button>
              </a>
            </div>
          </div>

          <div className="app-header__right">
            <Space size={4}>
              <Tooltip title={t('layout.darkMode')}>
                <Button
                  type="text"
                  icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleDarkMode}
                  style={{ borderRadius: 8 }}
                />
              </Tooltip>

              <Tooltip title={t('layout.language')}>
                <Button
                  type="text"
                  icon={<GlobalOutlined />}
                  onClick={toggleLanguageHandler}
                  style={{ borderRadius: 8 }}
                />
              </Tooltip>

              <Tooltip title={t('layout.notifications')}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{ borderRadius: 8 }}
                />
              </Tooltip>

              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                trigger={['click']}
              >
                <div className="app-header__user">
                  <div className="app-header__avatar">
                    {user ? getInitials(user.name) : '?'}
                  </div>
                </div>
              </Dropdown>
            </Space>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
