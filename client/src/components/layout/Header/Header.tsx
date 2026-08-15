import { useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Dropdown, Avatar, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  PlusOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app.store';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/helpers';
import './Header.scss';

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
  '/profile': 'profile.title',
  '/settings': 'settings.title',
};

function getPageMeta(pathname: string): { titleKey: string; hintKey?: string } {
  if (pathname === '/') {
    return { titleKey: 'dashboard.title', hintKey: 'layout.subtitle' };
  }

  const segments = pathname.split('/').filter(Boolean);
  const basePath = '/' + (segments[0] ?? '');

  if (basePath === '/patients' && segments[1] === 'new') {
    return { titleKey: 'patients.newPatient', hintKey: 'patients.title' };
  }
  if (basePath === '/operations' && segments[1] === 'new') {
    return { titleKey: 'operations.addOperation', hintKey: 'operations.title' };
  }
  if (basePath === '/operations' && segments[2] === 'edit') {
    return { titleKey: 'operations.editOperation', hintKey: 'operations.title' };
  }
  if (basePath === '/operations' && segments[1] && segments[1] !== 'new') {
    return { titleKey: 'operations.operationDetails', hintKey: 'operations.title' };
  }
  if (basePath === '/patients' && segments[1] && segments[1] !== 'new') {
    return { titleKey: 'patients.patientDetails', hintKey: 'patients.title' };
  }

  if (PAGE_TITLES[basePath]) {
    return { titleKey: PAGE_TITLES[basePath] };
  }

  return { titleKey: 'dashboard.title' };
}

function roleLabel(role?: string): string {
  if (!role) return '';
  return role.charAt(0) + role.slice(1).toLowerCase();
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

  const pageMeta = useMemo(() => getPageMeta(location.pathname), [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;
      event.preventDefault();
      navigate('/search');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  const userMenuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'user-info',
        disabled: true,
        label: (
          <div className="userMenuHeader">
            <span className="userMenuName">{user?.name ?? '—'}</span>
            <span className="userMenuMeta">
              {user?.email}
              {user?.role ? ` · ${roleLabel(user.role)}` : ''}
            </span>
          </div>
        ),
      },
      { type: 'divider' },
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
    [t, user],
  );

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login', { replace: true });
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/profile');
    }
  };

  return (
    <header
      className={`app-header-root header ${collapsed ? 'headerCollapsed' : ''}`}
    >
      <div className="headerLeft">
        <button
          className="menuTrigger"
          onClick={onMenuClick}
          type="button"
          aria-label={t('layout.header')}
        >
          <MenuOutlined />
        </button>

        {/* <div className="brandMobile">
          <span className="brandIcon">
            <MedicineBoxOutlined />
          </span>
          <span className="brandText">MedAxis</span>
        </div> */}

        {/* <div className="pageHeading">
          <h1 className="pageTitle">{t(pageMeta.titleKey)}</h1>
          {pageMeta.hintKey && (
            <p className="pageHint">{t(pageMeta.hintKey)}</p>
          )}
        </div> */}
      </div>

      {/* <div className="headerCenter">
        <button
          type="button"
          className="searchTrigger"
          onClick={() => navigate('/search')}
          aria-label={t('search.title')}
        >
          <SearchOutlined className="searchTriggerIcon" />
          <span className="searchTriggerText">{t('search.placeholder')}</span>
          <kbd className="searchTriggerKbd">/</kbd>
        </button>
      </div> */}

      <div className="headerRight">
        <Tooltip title={t('operations.addOperation')}>
          <Button
            type="primary"
            className="quickAddBtn"
            icon={<PlusOutlined />}
            onClick={() => navigate('/operations/new')}
          >
            <span className="quickAddLabel">{t('operations.addOperation')}</span>
          </Button>
        </Tooltip>

        <div className="headerActions">
          <Tooltip title={language === 'en' ? t('layout.arabic') : t('layout.english')}>
            <button
              type="button"
              className="langBtn"
              onClick={toggleLanguage}
              aria-label={t('layout.language')}
            >
              <GlobalOutlined />
              <span className="langCode">{language.toUpperCase()}</span>
            </button>
          </Tooltip>

          <Tooltip title={darkMode ? t('settings.lightMode') : t('settings.darkMode')}>
            <Button
              type="text"
              className={`iconBtn ${darkMode ? 'iconBtnActive' : ''}`}
              icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleDarkMode}
              aria-label={t('layout.darkMode')}
            />
          </Tooltip>
        </div>

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          trigger={['click']}
          placement="bottomRight"
          overlayClassName="headerUserDropdown"
        >
          <button className="avatarBtn" type="button">
            <Avatar
              size={34}
              className="userAvatar"
              src={user?.avatarUrl || undefined}
              style={{
                backgroundColor: user?.avatarUrl ? undefined : '#2563EB',
              }}
            >
              {user ? getInitials(user.name) : '?'}
            </Avatar>
            <span className="userMeta">
              <span className="userName">{user?.name}</span>
              {user?.role && (
                <span className="userRole">{roleLabel(user.role)}</span>
              )}
            </span>
            <DownOutlined className="userCaret" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
