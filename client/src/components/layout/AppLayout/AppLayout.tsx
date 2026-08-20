import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/app.store';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import BottomNav from '../BottomNav/BottomNav';
import PwaInstallPrompt from '../../PwaInstallPrompt/PwaInstallPrompt';
import './AppLayout.scss';

/** Routes where sticky form actions replace bottom-nav-adjacent chrome padding. */
function isWizardRoute(pathname: string): boolean {
  return (
    pathname === '/patients/new' ||
    pathname === '/operations/new' ||
    /^\/operations\/[^/]+\/edit$/.test(pathname)
  );
}

export default function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const darkMode = useAppStore((s) => s.darkMode);
  const direction = useAppStore((s) => s.direction);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleMenuClick = useCallback(() => {
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      toggleSidebar();
    }
  }, [toggleSidebar]);

  const handleMoreClick = useCallback(() => {
    setMobileOpen(true);
  }, []);

  // Always keep the mobile drawer closed when the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close the drawer if the viewport grows past mobile
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen((open) => (open ? false : open));
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const wizardMode = isWizardRoute(location.pathname);

  return (
    <div
      className={`app-layout layout ${darkMode ? 'dark' : ''} ${wizardMode ? 'wizardMode' : ''}`}
      dir={direction}
    >
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />

      <div className={`mainArea ${collapsed ? 'mainAreaCollapsed' : ''}`}>
        <Header onMenuClick={handleMenuClick} />

        <main className="content">
          <Outlet />
        </main>
      </div>

      <BottomNav onMoreClick={handleMoreClick} />
      <PwaInstallPrompt />
    </div>
  );
}
