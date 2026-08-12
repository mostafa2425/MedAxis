import { useMemo } from 'react';
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
import styles from './Sidebar.module.scss';

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

  const sidebarContent = useMemo(
    () => (
      <div className={styles.sidebar}>
        {/* ─── Logo Area ─────────────────────────────── */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <MedicineBoxOutlined />
          </div>
          {!collapsed && <span className={styles.logoText}>MedAxis</span>}
        </div>

        {/* ─── Main Navigation ───────────────────────── */}
        <nav className={styles.nav}>
          {mainMenuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.key}
              end={item.key === '/'}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.menuItemActive : ''} ${collapsed ? styles.menuItemCollapsed : ''}`
              }
              onClick={() => onMobileClose()}
            >
              <span className={styles.menuItemIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.menuItemLabel}>{t(item.labelKey)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ─── Bottom Actions ─────────────────────────── */}
        <div className={styles.bottomActions}>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.menuItemActive : ''} ${collapsed ? styles.menuItemCollapsed : ''}`
            }
            onClick={() => onMobileClose()}
          >
            <span className={styles.menuItemIcon}><SettingOutlined /></span>
            {!collapsed && <span className={styles.menuItemLabel}>{t('sidebar.settings')}</span>}
          </NavLink>

          <button
            className={`${styles.menuItem} ${styles.logoutBtn} ${collapsed ? styles.menuItemCollapsed : ''}`}
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
              onMobileClose();
            }}
            type="button"
          >
            <span className={styles.menuItemIcon}><LogoutOutlined /></span>
            {!collapsed && <span className={styles.menuItemLabel}>{t('nav.logout')}</span>}
          </button>
        </div>
      </div>
    ),
    [collapsed, darkMode, t, logout, navigate, onMobileClose]
  );

  return (
    <>
      {/* ─── Desktop Sidebar ────────────────────────── */}
      <aside className={`${styles.desktopSidebar} ${collapsed ? styles.desktopSidebarCollapsed : ''} ${darkMode ? styles.dark : ''}`}>
        {sidebarContent}
      </aside>

      {/* ─── Mobile Drawer ──────────────────────────── */}
      <Drawer
        placement={useAppStore((s) => s.direction) === 'rtl' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={onMobileClose}
        width={280}
        closable={false}
        styles={{
          body: { padding: 0 },
          header: { display: 'none' },
        }}
        className={styles.mobileDrawer}
      >
        <div className={styles.mobileOverlayContent}>
          {sidebarContent}
        </div>
      </Drawer>
    </>
  );
}
