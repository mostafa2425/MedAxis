import React, { useEffect, useMemo, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import AppLayout from '@/components/layout/AppLayout/AppLayout';

const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const VerifyEmailPage = React.lazy(() => import('@/pages/auth/VerifyEmailPage'));
const DashboardPage = React.lazy(() => import('@/pages/Dashboard'));
const AssistantPage = React.lazy(() => import('@/pages/Assistant'));
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
const CalendarPage = React.lazy(() => import('@/pages/Calendar'));
const FollowUpsPage = React.lazy(() => import('@/pages/FollowUps'));
const ProfilePage = React.lazy(() => import('@/pages/Profile'));
const ReportsPage = React.lazy(() => import('@/pages/Reports'));

function PageLoader() {
  return (
    <div className="medaxis-page-loader" role="status" aria-live="polite" aria-label="Loading MedAxis">
      <style>{`
        .medaxis-page-loader {
          min-height: 100vh;
          width: 100%;
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 35%, rgba(37, 99, 235, 0.10), transparent 32%),
            linear-gradient(180deg, #f8fbff 0%, #ffffff 72%);
          color: #0f172a;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .medaxis-page-loader::before,
        .medaxis-page-loader::after {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(37, 99, 235, 0.08);
          animation: medaxis-loader-pulse 2.8s ease-out infinite;
        }
        .medaxis-page-loader::after { animation-delay: 1.4s; }
        .medaxis-loader-card {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 28px 34px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(14px);
        }
        .medaxis-loader-mark {
          width: 68px;
          height: 68px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          position: relative;
          color: #2563eb;
          background: linear-gradient(145deg, #eff6ff, #dbeafe);
          box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.08);
        }
        .medaxis-loader-mark .anticon { font-size: 31px; }
        .medaxis-loader-ring {
          position: absolute;
          width: 78px;
          height: 78px;
          border: 2px solid rgba(37, 99, 235, 0.12);
          border-top-color: #2563eb;
          border-right-color: #60a5fa;
          border-radius: 50%;
          animation: medaxis-loader-spin 1s linear infinite;
        }
        .medaxis-loader-brand { font-size: 18px; font-weight: 700; letter-spacing: 0.08em; }
        .medaxis-loader-text { color: #64748b; font-size: 13px; }
        .medaxis-loader-dots { display: flex; gap: 5px; margin-top: 1px; }
        .medaxis-loader-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2563eb;
          animation: medaxis-loader-bounce 1.2s ease-in-out infinite;
        }
        .medaxis-loader-dot:nth-child(2) { animation-delay: .15s; }
        .medaxis-loader-dot:nth-child(3) { animation-delay: .30s; }
        @keyframes medaxis-loader-spin { to { transform: rotate(360deg); } }
        @keyframes medaxis-loader-pulse {
          0% { transform: scale(.72); opacity: .55; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes medaxis-loader-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: .45; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .medaxis-page-loader::before,
          .medaxis-page-loader::after,
          .medaxis-loader-ring,
          .medaxis-loader-dot { animation: none; }
        }
        @media (prefers-color-scheme: dark) {
          .medaxis-page-loader {
            background: radial-gradient(circle at 50% 35%, rgba(59, 130, 246, 0.12), transparent 32%), #0f172a;
            color: #f8fafc;
          }
          .medaxis-loader-card { background: rgba(30, 41, 59, 0.82); border-color: rgba(148, 163, 184, 0.12); }
          .medaxis-loader-mark { background: rgba(37, 99, 235, 0.14); }
          .medaxis-loader-text { color: #94a3b8; }
        }
      `}</style>
      <div className="medaxis-loader-card">
        <div className="medaxis-loader-mark">
          <div className="medaxis-loader-ring" aria-hidden="true" />
          <MedicineBoxOutlined />
        </div>
        <div className="medaxis-loader-brand">MEDAXIS</div>
        <div className="medaxis-loader-text">Preparing your workspace</div>
        <div className="medaxis-loader-dots" aria-hidden="true">
          <span className="medaxis-loader-dot" />
          <span className="medaxis-loader-dot" />
          <span className="medaxis-loader-dot" />
        </div>
      </div>
    </div>
  );
}

function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  if (isInitializing) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Suspense fallback={<PageLoader />}><AppLayout /></Suspense>;
}

const MEDAXIS_THEME = { token: { colorPrimary: '#2563EB', colorSuccess: '#16A34A', colorWarning: '#F59E0B', colorError: '#DC2626', colorInfo: '#0284C7', borderRadius: 8, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 14, controlHeight: 40 }, components: { Button: { borderRadius: 8, controlHeight: 40 }, Input: { borderRadius: 8, controlHeight: 40 }, Select: { borderRadius: 8, controlHeight: 40 }, Table: { borderRadius: 12, headerBg: '#F8FAFC', headerColor: '#475569', rowHoverBg: '#F8FAFC' }, Card: { borderRadius: 12 }, Modal: { borderRadius: 20 }, Tag: { borderRadiusSM: 6 } } };
const MEDAXIS_DARK_THEME = { token: { colorPrimary: '#3B82F6', colorSuccess: '#22C55E', colorWarning: '#FBBF24', colorError: '#EF4444', colorInfo: '#38BDF8', colorBgContainer: '#1E293B', colorBgElevated: '#334155', colorBorder: '#334155', colorText: '#F1F5F9', colorTextSecondary: '#94A3B8', borderRadius: 8, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 14, controlHeight: 40 }, components: { Button: { borderRadius: 8, controlHeight: 40 }, Input: { borderRadius: 8, controlHeight: 40, colorBgContainer: '#334155' }, Select: { borderRadius: 8, controlHeight: 40 }, Table: { borderRadius: 12, headerBg: '#1E293B', headerColor: '#94A3B8', rowHoverBg: '#334155', colorBgContainer: '#1E293B' }, Card: { borderRadius: 12, colorBgContainer: '#1E293B' }, Modal: { borderRadius: 20, contentBg: '#1E293B' } } };

export default function App() {
  const darkMode = useAppStore((s) => s.darkMode);
  const direction = useAppStore((s) => s.direction);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const theme = useMemo(() => darkMode ? { ...MEDAXIS_DARK_THEME, algorithm: antTheme.darkAlgorithm } : { ...MEDAXIS_THEME, algorithm: antTheme.defaultAlgorithm }, [darkMode]);
  useEffect(() => { void initializeAuth(); }, [initializeAuth]);

  return <ConfigProvider theme={theme} direction={direction === 'rtl' ? 'rtl' : 'ltr'}><Suspense fallback={<PageLoader />}><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route element={<RequireAuth />}>
      <Route path="/" element={<DashboardPage />} /><Route path="/assistant" element={<AssistantPage />} /><Route path="/patients" element={<PatientsPage />} /><Route path="/patients/new" element={<PatientFormPage />} /><Route path="/patients/:id" element={<PatientDetailPage />} /><Route path="/operations" element={<OperationsPage />} /><Route path="/operations/new" element={<OperationFormPage />} /><Route path="/operations/:id" element={<OperationDetailPage />} /><Route path="/operations/:id/edit" element={<OperationEditPage />} /><Route path="/doctors" element={<DoctorsPage />} /><Route path="/hospitals" element={<HospitalsPage />} /><Route path="/specialties" element={<SpecialtiesPage />} /><Route path="/search" element={<SearchPage />} /><Route path="/calendar" element={<CalendarPage />} /><Route path="/follow-ups" element={<FollowUpsPage />} /><Route path="/reports" element={<ReportsPage />} /><Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></ConfigProvider>;
}
