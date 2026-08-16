import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Input,
  DatePicker,
  Tag,
  Skeleton,
  Spin,
  Avatar,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  BankOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { searchService } from '@/services/search.service';
import type { SearchResult } from '@/services/search.service';
import type { SearchFilters } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { OPERATION_STATUSES } from '@/utils/constants';
import { getInitials } from '@/utils/helpers';
import OperationSchedule from '@/components/OperationSchedule/OperationSchedule';
import { type Dayjs } from 'dayjs';
import './Search.scss';

// ─── Type Filter Options ───────────────────────
type SearchType = 'all' | 'patients' | 'operations' | 'doctors' | 'hospitals';

const TYPE_FILTERS: { key: SearchType; icon: React.ReactNode }[] = [
  { key: 'all', icon: <SearchOutlined /> },
  { key: 'patients', icon: <UserOutlined /> },
  { key: 'operations', icon: <FileTextOutlined /> },
  { key: 'doctors', icon: <TeamOutlined /> },
  { key: 'hospitals', icon: <BankOutlined /> },
];

const TYPE_LABEL_KEYS: Record<SearchType, string> = {
  all: 'search.allResults',
  patients: 'search.patients',
  operations: 'search.operations',
  doctors: 'search.doctors',
  hospitals: 'hospitals.title',
};

// ─── Status Helper ─────────────────────────────
function getOperationStatusStyle(status: string) {
  const found = OPERATION_STATUSES.find((s) => s.value === status);
  if (found) {
    return {
      color: found.color,
      background: found.bg,
      borderColor: `${found.color}33`,
    };
  }
  return {
    color: '#94A3B8',
    background: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
  };
}

function formatStatusLabel(status: string): string {
  const found = OPERATION_STATUSES.find((s) => s.value === status);
  return found ? found.label : status;
}

// ═══════════════════════════════════════════════════════
// Search Page
// ═══════════════════════════════════════════════════════
export default function SearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<SearchType>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const debouncedQuery = useDebounce(searchQuery, 400);

  const hasSearch = debouncedQuery.trim().length >= 2;

  // ─── Search Query ────────────────────────────
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['global-search', debouncedQuery, activeType, dateRange?.[0]?.toISOString(), dateRange?.[1]?.toISOString()],
    queryFn: () => {
      const params: SearchFilters = {
        query: debouncedQuery,
        limit: 50,
      };
      if (activeType !== 'all') {
        params.type = activeType;
      }
      if (dateRange?.[0]) {
        params.dateFrom = dateRange[0]!.format('YYYY-MM-DD');
      }
      if (dateRange?.[1]) {
        params.dateTo = dateRange[1]!.format('YYYY-MM-DD');
      }
      return searchService.globalSearch(params);
    },
    enabled: hasSearch,
  });

  const results: SearchResult | null = data?.data?.data ?? null;

  // ─── Computed counts ────────────────────────
  const counts = useMemo(() => ({
    patients: results?.patients?.length ?? 0,
    operations: results?.operations?.length ?? 0,
    doctors: results?.doctors?.length ?? 0,
    hospitals: results?.hospitals?.length ?? 0,
    total: (results?.patients?.length ?? 0)
      + (results?.operations?.length ?? 0)
      + (results?.doctors?.length ?? 0)
      + (results?.hospitals?.length ?? 0),
  }), [results]);

  // ─── Handlers ────────────────────────────────
  const handleTypeChange = useCallback((type: SearchType) => {
    setActiveType(type);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDateRangeChange = useCallback((dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
  }, []);

  // ─── Navigation handlers ─────────────────────
  const goToPatient = useCallback((id: string) => navigate(`/patients/${id}`), [navigate]);
  const goToOperation = useCallback((id: string) => navigate(`/operations/${id}`), [navigate]);
  const goToDoctor = useCallback((_id: string) => navigate(`/doctors`), [navigate]);
  const goToHospital = useCallback((_id: string) => navigate(`/hospitals`), [navigate]);

  // ─── Render: Patient Result ──────────────────
  const renderPatientResult = (patient: SearchResult['patients'][0]) => (
    <div key={patient.id} className="resultCard" onClick={() => goToPatient(patient.id)}>
      <Avatar
        size={40}
        className={
          patient.gender === 'MALE' ? 'resultAvatar resultAvatarMale' : 'resultAvatar resultAvatarFemale'
        }
      >
        {getInitials(patient.fullName)}
      </Avatar>
      <div className="resultInfo">
        <span className="resultTitle">{patient.fullName}</span>
        <span className="resultSubtitle">
          <PhoneOutlined style={{ marginRight: 4 }} />
          {patient.mobile}
        </span>
      </div>
      <div className="resultMeta">
        <Tag
          style={{
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 500,
            color: patient.gender === 'MALE' ? '#2563EB' : '#EC4899',
            background: patient.gender === 'MALE' ? 'rgba(37,99,235,0.1)' : 'rgba(236,72,153,0.1)',
            border: `1px solid ${patient.gender === 'MALE' ? 'rgba(37,99,235,0.2)' : 'rgba(236,72,153,0.2)'}`,
          }}
        >
          {patient.gender === 'MALE' ? t('patients.male') : t('patients.female')}
        </Tag>
      </div>
    </div>
  );

  // ─── Render: Operation Result ────────────────
  const renderOperationResult = (op: SearchResult['operations'][0]) => {
    const statusStyle = getOperationStatusStyle(op.status);
    return (
      <div key={op.id} className="resultCard" onClick={() => goToOperation(op.id)}>
        <div className="resultIcon resultIcon--operation">
          <FileTextOutlined />
        </div>
        <div className="resultInfo">
          <span className="resultTitle">{op.name}</span>
          <span className="resultSubtitle">
            {op.patient ? `${t('patients.title')}: ${op.patient.fullName}` : ''}
          </span>
        </div>
        <div className="resultMeta">
          <span className="resultMetaItem">
            <CalendarOutlined />
            <OperationSchedule date={op.operationDate} time={op.operationTime} stacked={false} />
          </span>
          <span
            className="statusBadge"
            style={{
              color: statusStyle.color,
              background: statusStyle.background,
              border: `1px solid ${statusStyle.borderColor}`,
            }}
          >
            {formatStatusLabel(op.status)}
          </span>
        </div>
      </div>
    );
  };

  // ─── Render: Doctor Result ───────────────────
  const renderDoctorResult = (doctor: SearchResult['doctors'][0]) => (
    <div key={doctor.id} className="resultCard" onClick={() => goToDoctor(doctor.id)}>
      <Avatar size={40} className="resultAvatar resultAvatarDoctor">
        {getInitials(doctor.name)}
      </Avatar>
      <div className="resultInfo">
        <span className="resultTitle">{doctor.name}</span>
        <span className="resultSubtitle">
          {(doctor.specialties ?? []).map((s) => s.name).join(', ')}
        </span>
      </div>
      <div className="resultMeta">
        <span className="resultMetaItem">
          <PhoneOutlined />
          {doctor.phone || '—'}
        </span>
      </div>
    </div>
  );

  // ─── Render: Hospital Result ─────────────────
  const renderHospitalResult = (hospital: SearchResult['hospitals'][0]) => (
    <div key={hospital.id} className="resultCard" onClick={() => goToHospital(hospital.id)}>
      <div className="resultIcon resultIcon--hospital">
        <BankOutlined />
      </div>
      <div className="resultInfo">
        <span className="resultTitle">{hospital.name}</span>
        <span className="resultSubtitle">
          {hospital.address || hospital.phone || '—'}
        </span>
      </div>
      <div className="resultMeta">
        {hospital.phone && (
          <span className="resultMetaItem">
            <PhoneOutlined />
            {hospital.phone}
          </span>
        )}
      </div>
    </div>
  );

  // ─── Render: Loading Skeletons ───────────────
  const renderLoadingSkeletons = () => (
    <div className="loadingState">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="loadingRow">
          <Skeleton.Avatar active size={44} shape="square" style={{ borderRadius: 12 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton.Input active size="small" style={{ width: `${60 + Math.random() * 30}%`, height: 18 }} />
            <Skeleton.Input active size="small" style={{ width: `${40 + Math.random() * 30}%`, height: 14 }} />
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Determine what to render ────────────────
  const showPatients = activeType === 'all' || activeType === 'patients';
  const showOperations = activeType === 'all' || activeType === 'operations';
  const showDoctors = activeType === 'all' || activeType === 'doctors';
  const showHospitals = activeType === 'all' || activeType === 'hospitals';

  const hasResults = results && counts.total > 0;

  return (
    <div className="search-page page">
      {/* ─── Page Header ──────────────────────────── */}
      <div className="pageHeader">
        <h1 className="pageTitle">{t('search.title')}</h1>
      </div>

      {/* ─── Search Box ──────────────────────────── */}
      <div className="searchBox">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={handleSearchChange}
          allowClear
        />
      </div>

      {/* ─── Filters Row ─────────────────────────── */}
      {hasSearch && (
        <div className="filtersRow">
          <div className="typeFilters">
            {TYPE_FILTERS.map((tf) => {
              const isActive = activeType === tf.key;
              const count = tf.key === 'all' ? counts.total : counts[tf.key as keyof typeof counts];
              return (
                <button
                  key={tf.key}
                  type="button"
                  className={`typeFilterBtn ${isActive ? 'typeFilterBtn--active' : ''}`}
                  onClick={() => handleTypeChange(tf.key)}
                >
                  {tf.icon}
                  {t(TYPE_LABEL_KEYS[tf.key])}
                  <span className={`typeFilterCount ${isActive ? 'typeFilterCount--active' : ''}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="dateRange">
            <DatePicker.RangePicker
              size="middle"
              onChange={handleDateRangeChange}
              placeholder={[t('common.from'), t('common.to')]}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* ─── Content Area ─────────────────────────── */}
      {!hasSearch ? (
        // ─── Initial / Empty (no search yet) ────
        <div className="emptyState">
          <SearchOutlined className="emptyIcon" />
          <div className="emptyTitle">{t('search.title')}</div>
          <div className="emptyDescription">{t('search.placeholder')}</div>
        </div>
      ) : isLoading ? (
        // ─── Loading State ────────────────────────
        <>
          <Spin spinning={isFetching}>
            {renderLoadingSkeletons()}
          </Spin>
        </>
      ) : isError ? (
        // ─── Error State ──────────────────────────
        <div className="emptyState">
          <SearchOutlined className="emptyIcon" />
          <div className="emptyTitle">{t('common.operationFailed')}</div>
          <div className="emptyDescription">{t('common.networkError')}</div>
        </div>
      ) : !hasResults ? (
        // ─── No Results ────────────────────────────
        <div className="emptyState">
          <SearchOutlined className="emptyIcon" />
          <div className="emptyTitle">
            {t('search.noResults', { query: searchQuery })}
          </div>
          <div className="emptyDescription">{t('common.noData')}</div>
        </div>
      ) : (
        // ─── Results ──────────────────────────────
        <div className="resultsSection">
          {/* ─── Patients Group ──────────────────────── */}
          {showPatients && results.patients.length > 0 && (
            <div className="resultGroup">
              <div className="groupHeader">
                <UserOutlined style={{ color: '#2563EB' }} />
                <span className="groupTitle">{t('patients.title')}</span>
                <span className="groupCount">{results.patients.length}</span>
              </div>
              {results.patients.map(renderPatientResult)}
            </div>
          )}

          {/* ─── Operations Group ──────────────────── */}
          {showOperations && results.operations.length > 0 && (
            <div className="resultGroup">
              <div className="groupHeader">
                <FileTextOutlined style={{ color: '#7C3AED' }} />
                <span className="groupTitle">{t('operations.title')}</span>
                <span className="groupCount">{results.operations.length}</span>
              </div>
              {results.operations.map(renderOperationResult)}
            </div>
          )}

          {/* ─── Doctors Group ──────────────────────── */}
          {showDoctors && results.doctors.length > 0 && (
            <div className="resultGroup">
              <div className="groupHeader">
                <TeamOutlined style={{ color: '#16A34A' }} />
                <span className="groupTitle">{t('doctors.title')}</span>
                <span className="groupCount">{results.doctors.length}</span>
              </div>
              {results.doctors.map(renderDoctorResult)}
            </div>
          )}

          {/* ─── Hospitals Group ────────────────────── */}
          {showHospitals && results.hospitals.length > 0 && (
            <div className="resultGroup">
              <div className="groupHeader">
                <BankOutlined style={{ color: '#0EA5E9' }} />
                <span className="groupTitle">{t('hospitals.title')}</span>
                <span className="groupCount">{results.hospitals.length}</span>
              </div>
              {results.hospitals.map(renderHospitalResult)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
