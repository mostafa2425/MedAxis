import { NavLink, useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ScissorOutlined,
  UserOutlined,
  BankOutlined,
  TagOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app.store';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.scss';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  labelKey: string;
}

const mainMenuItems: MenuItem[] = [
  { key: '/', icon: <DashboardOutlined />, labelKey: 'sidebar.dashboard' },
  { key: '/patients', icon: <TeamOutlined />, labelKey: 'sidebar.patients' },
  { key: '/operations', icon: <ScissorOutlined />, labelKey: 'sidebar.operations' },
  { key: '/doctors', icon: <UserOutlined />, labelKey: 'sidebar.doctors' },
  { key: '/hospitals', icon: <BankOutlined />, labelKey: 'sidebar.hospitals' },
  { key: '/specialties', icon: <TagOutlined />, labelKey: 'sidebar.specialties' },
  { key: '/search', icon: <SearchOutlined />, labelKey: 'nav.search' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const darkMode = useAppStore((s) => s.darkMode);
  const direction = useAppStore((s) => s.direction);

  const renderSidebar = (isCollapsed: boolean) => (
    <div className="sidebar">
      <div className="logo">
        <div className="logoIcon">
          <MedicineBoxOutlined />
        </div>
        {!isCollapsed && <span className="logoText">MedAxis</span>}
      </div>

      <nav className="nav">
        {mainMenuItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.key}
            end={item.key === '/'}
            className={({ isActive }) =>
              `menuItem ${isActive ? 'menuItemActive' : ''} ${isCollapsed ? 'menuItemCollapsed' : ''}`
            }
            onClick={() => onMobileClose()}
          >
            <span className="menuItemIcon">{item.icon}</span>
            {!isCollapsed && (
              <span className="menuItemLabel">{t(item.labelKey)}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="bottomActions">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `menuItem ${isActive ? 'menuItemActive' : ''} ${isCollapsed ? 'menuItemCollapsed' : ''}`
          }
          onClick={() => onMobileClose()}
        >
          <span className="menuItemIcon">
            <SettingOutlined />
          </span>
          {!isCollapsed && (
            <span className="menuItemLabel">{t('layout.profile')}</span>
          )}
        </NavLink>

        <button
          className={`menuItem logoutBtn ${isCollapsed ? 'menuItemCollapsed' : ''}`}
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
            onMobileClose();
          }}
          type="button"
        >
          <span className="menuItemIcon">
            <LogoutOutlined />
          </span>
          {!isCollapsed && (
            <span className="menuItemLabel">{t('nav.logout')}</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`app-sidebar-root desktopSidebar ${collapsed ? 'desktopSidebarCollapsed' : ''} ${darkMode ? 'dark' : ''}`}
      >
        {renderSidebar(collapsed)}
      </aside>

      <Drawer
        placement={direction === 'rtl' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={onMobileClose}
        width={280}
        closable={false}
        styles={{
          body: { padding: 0 },
          header: { display: 'none' },
        }}
        className="mobileDrawer"
      >
        <div className="app-sidebar-root mobileOverlayContent">{renderSidebar(false)}</div>
      </Drawer>
    </>
  );
}
