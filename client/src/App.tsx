import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme, Spin } from 'antd';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import AppLayout from '@/components/layout/AppLayout/AppLayout';

// ── Lazy-loaded Pages ───────────────────────────────
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('@/pages/Dashboard'));
const PatientsPage = React.lazy(() => import('@/pages/Patients'));
const PatientFormPage = React.lazy(() => import('@/pages/Patients/NewPatient'));
const PatientDetailPage = React.lazy(() => import('@/pages/Patients/PatientDetail'));
const OperationsPage = React.lazy(() => import('@/pages/Operations'));
const OperationFormPage = React.lazy(() => import('@/pages/Operations/NewOperation'));
const OperationDetailPage = React.lazy(() => import('@/pages/Operations/OperationDetail'));
const OperationEditPage = React.lazy(() => import('@/pages/Operations/EditOperation'));
const DoctorsPage = React.lazy(() => import('@/pages/Doctors'));
const HospitalsPage = React.lazy(() => import('@/pages/Hospitals'));
const SpecialtiesPage = React.lazy(() => import('@/pages/Specialties'));
const SearchPage = React.lazy(() => import('@/pages/Search'));

// ── Loading Fallback ─────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <Spin size="large" />
    </div>
  );
}

// ── RequireAuth ─────────────────────────────────────
function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <AppLayout />
    </Suspense>
  );
}

// ── Ant Design Themes ───────────────────────────────
const MEDAXIS_THEME = {
  token: {
    colorPrimary: '#2563EB',
    colorSuccess: '#16A34A',
    colorWarning: '#F59E0B',
    colorError: '#DC2626',
    colorInfo: '#0284C7',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    controlHeight: 40,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#F8FAFC',
      headerColor: '#475569',
      rowHoverBg: '#F8FAFC',
    },
    Card: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 20,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};

const MEDAXIS_DARK_THEME = {
  token: {
    colorPrimary: '#3B82F6',
    colorSuccess: '#22C55E',
    colorWarning: '#FBBF24',
    colorError: '#EF4444',
    colorInfo: '#38BDF8',
    colorBgContainer: '#1E293B',
    colorBgElevated: '#334155',
    colorBorder: '#334155',
    colorText: '#F1F5F9',
    colorTextSecondary: '#94A3B8',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    controlHeight: 40,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: '#334155',
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#1E293B',
      headerColor: '#94A3B8',
      rowHoverBg: '#334155',
      colorBgContainer: '#1E293B',
    },
    Card: {
      borderRadius: 12,
      colorBgContainer: '#1E293B',
    },
    Modal: {
      borderRadius: 20,
      contentBg: '#1E293B',
    },
  },
};

// ── App Component ────────────────────────────────────
export default function App() {
  const darkMode = useAppStore((s) => s.darkMode);
  const direction = useAppStore((s) => s.direction);

  return (
    <ConfigProvider
      theme={
        darkMode
          ? { ...MEDAXIS_DARK_THEME, algorithm: antTheme.darkAlgorithm }
          : { ...MEDAXIS_THEME, algorithm: antTheme.defaultAlgorithm }
      }
      direction={direction === 'rtl' ? 'rtl' : 'ltr'}
    >
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ──────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected Routes ───────────────────── */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/new" element={<PatientFormPage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/operations" element={<OperationsPage />} />
            <Route path="/operations/new" element={<OperationFormPage />} />
            <Route path="/operations/:id" element={<OperationDetailPage />} />
            <Route path="/operations/:id/edit" element={<OperationEditPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>

          {/* ── Fallback ─────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
}
