import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/stores/app.store';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './AppLayout.module.scss';

export default function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const darkMode = useAppStore((s) => s.darkMode);
  const direction = useAppStore((s) => s.direction);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

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

  return (
    <div
      className={`${styles.layout} ${darkMode ? styles.dark : ''}`}
      dir={direction}
    >
      {/* ─── Sidebar ──────────────────────────────── */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />

      {/* ─── Main Area ────────────────────────────── */}
      <div
        className={`${styles.mainArea} ${collapsed ? styles.mainAreaCollapsed : ''}`}
      >
        {/* ─── Header ─────────────────────────────── */}
        <Header onMenuClick={handleMenuClick} />

        {/* ─── Page Content ───────────────────────── */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
