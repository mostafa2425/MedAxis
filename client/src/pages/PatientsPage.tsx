import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Input,
  Avatar,
  Tag,
  Pagination,
  Skeleton,
  Empty,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { patientService } from '@/services/patient.service';
import { useDebounce } from '@/hooks/useDebounce';
import { getInitials, formatDate } from '@/utils/helpers';
import { DEFAULT_PAGINATION } from '@/utils/constants';
import { Gender, type Patient } from '@/types';
import dayjs from 'dayjs';
import styles from './PatientsPage.module.scss';

// ─── Age from dateOfBirth ─────────────────────────
function computeAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  return dayjs().diff(dayjs(dateOfBirth), 'year');
}

// ─── Skeleton Card (Mobile) ───────────────────────
function SkeletonCard() {
  return (
    <div className={styles.patientCard}>
      <div className={styles.cardHeader}>
        <Skeleton.Avatar active size={48} shape="circle" />
        <div className={styles.cardHeaderInfo}>
          <Skeleton.Input active size="small" style={{ width: 140, height: 18 }} />
          <Skeleton.Input active size="small" style={{ width: 90, height: 14, marginTop: 8 }} />
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <Skeleton.Input active size="small" style={{ width: 100, height: 14 }} />
          <Skeleton.Input active size="small" style={{ width: 120, height: 14 }} />
        </div>
        <div className={styles.cardFooter}>
          <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Row (Desktop) ───────────────────────
function SkeletonRow() {
  return (
    <div className={styles.patientRow}>
      <div className={styles.rowMain}>
        <Skeleton.Avatar active size={40} shape="circle" />
        <div className={styles.rowInfo}>
          <Skeleton.Input active size="small" style={{ width: 160, height: 18 }} />
          <Skeleton.Input active size="small" style={{ width: 100, height: 14, marginTop: 6 }} />
        </div>
      </div>
      <div className={styles.rowDetails}>
        <Skeleton.Input active size="small" style={{ width: 60, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 100, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 90, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
      </div>
    </div>
  );
}

// ─── Gender Badge ─────────────────────────────────
function GenderBadge({ gender }: { gender: Gender }) {
  const { t } = useTranslation();
  const isMale = gender === Gender.Male;

  return (
    <Tag
      className={styles.genderBadge}
      style={{
        color: isMale ? '#2563EB' : '#EC4899',
        background: isMale ? 'rgba(37,99,235,0.1)' : 'rgba(236,72,153,0.1)',
        borderColor: isMale ? 'rgba(37,99,235,0.2)' : 'rgba(236,72,153,0.2)',
      }}
    >
      {isMale ? t('patients.male') : t('patients.female')}
    </Tag>
  );
}

// ─── Patient Card (Mobile) ────────────────────────
function PatientCard({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  const { t } = useTranslation();
  const age = computeAge(patient.dateOfBirth);

  return (
    <div className={styles.patientCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.cardHeader}>
        <Avatar
          size={48}
          className={styles.avatar}
          style={{
            backgroundColor:
              patient.gender === Gender.Male
                ? 'rgba(37,99,235,0.1)'
                : 'rgba(236,72,153,0.1)',
            color: patient.gender === Gender.Male ? '#2563EB' : '#EC4899',
          }}
        >
          {getInitials(patient.fullName)}
        </Avatar>
        <div className={styles.cardHeaderInfo}>
          <span className={styles.patientName}>{patient.fullName}</span>
          <div className={styles.cardHeaderMeta}>
            <GenderBadge gender={patient.gender} />
            {age !== null && (
              <span className={styles.patientAge}>
                {age} {t('common.age')}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          {patient.mobile && (
            <span className={styles.metaItem}>
              <PhoneOutlined className={styles.metaIcon} />
              {patient.mobile}
            </span>
          )}
          <span className={styles.metaItem}>
            <TeamOutlined className={styles.metaIcon} />
            {t('patients.operationsCount', {
              count: patient._count?.operations ?? 0,
            })}
          </span>
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.metaItem}>
            <CalendarOutlined className={styles.metaIcon} />
            {formatDate(patient.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Patient Row (Desktop) ────────────────────────
function PatientRow({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  const { t } = useTranslation();
  const age = computeAge(patient.dateOfBirth);

  return (
    <div className={styles.patientRow} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.rowMain}>
        <Avatar
          size={40}
          className={styles.avatar}
          style={{
            backgroundColor:
              patient.gender === Gender.Male
                ? 'rgba(37,99,235,0.1)'
                : 'rgba(236,72,153,0.1)',
            color: patient.gender === Gender.Male ? '#2563EB' : '#EC4899',
          }}
        >
          {getInitials(patient.fullName)}
        </Avatar>
        <div className={styles.rowInfo}>
          <span className={styles.patientName}>{patient.fullName}</span>
          <span className={styles.patientAgeSmall}>
            {age !== null ? `${age} ${t('common.age')}` : '—'}
          </span>
        </div>
      </div>
      <div className={styles.rowDetails}>
        <GenderBadge gender={patient.gender} />
        {patient.mobile && (
          <span className={styles.rowMetaItem}>
            <PhoneOutlined className={styles.metaIcon} />
            {patient.mobile}
          </span>
        )}
        <Tooltip title={t('patients.totalOperations')}>
          <span className={styles.rowMetaItem}>
            <TeamOutlined className={styles.metaIcon} />
            {patient._count?.operations ?? 0}
          </span>
        </Tooltip>
        <span className={styles.rowMetaItem}>
          <CalendarOutlined className={styles.metaIcon} />
          {formatDate(patient.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Patients List Page
// ═══════════════════════════════════════════════════════
export default function PatientsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['patients', page, debouncedSearch],
    queryFn: () =>
      patientService.getAll({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
      }),
  });

  const patients: Patient[] = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePatientClick = (id: string) => {
    navigate(`/patients/${id}`);
  };

  const handleKeyDown = (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  // ─── Loading State ───────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('patients.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/patients/new')}
            disabled
          >
            {t('patients.addPatient')}
          </Button>
        </div>

        <div className={styles.searchSection}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('patients.searchPlaceholder')}
            size="large"
            disabled
          />
        </div>

        <div className={styles.mobileView}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className={styles.desktopView}>
          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              <span className={styles.listColName}>{t('patients.fullName')}</span>
              <span className={styles.listColGender}>{t('patients.gender')}</span>
              <span className={styles.listColMobile}>{t('patients.mobile')}</span>
              <span className={styles.listColOps}>{t('patients.totalOperations')}</span>
              <span className={styles.listColDate}>{t('common.date')}</span>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────
  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('patients.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/patients/new')}
          >
            {t('patients.addPatient')}
          </Button>
        </div>

        <Empty
          className={styles.emptyState}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.operationFailed')}
        />
      </div>
    );
  }

  // ─── Empty State ─────────────────────────────────
  if (patients.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('patients.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/patients/new')}
          >
            {t('patients.addPatient')}
          </Button>
        </div>

        <div className={styles.searchSection}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('patients.searchPlaceholder')}
            size="large"
            value={search}
            onChange={handleSearchChange}
            allowClear
          />
        </div>

        <Empty
          className={styles.emptyState}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            debouncedSearch
              ? t('common.noResults')
              : t('patients.noPatients')
          }
        >
          {!debouncedSearch && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/patients/new')}
            >
              {t('patients.addPatient')}
            </Button>
          )}
        </Empty>
      </div>
    );
  }

  // ─── Main Content ────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ─── Page Header ────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>{t('patients.title')}</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/patients/new')}
        >
          {t('patients.addPatient')}
        </Button>
      </div>

      {/* ─── Search ────────────────────────────────── */}
      <div className={styles.searchSection}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('patients.searchPlaceholder')}
          size="large"
          value={search}
          onChange={handleSearchChange}
          allowClear
        />
      </div>

      {/* ─── Mobile Cards View ────────────────────── */}
      <div className={styles.mobileView}>
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onClick={() => handlePatientClick(patient.id)}
            onKeyDown={handleKeyDown(() => handlePatientClick(patient.id))}
          />
        ))}
      </div>

      {/* ─── Desktop List View ────────────────────── */}
      <div className={styles.desktopView}>
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <span className={styles.listColName}>{t('patients.fullName')}</span>
            <span className={styles.listColGender}>{t('patients.gender')}</span>
            <span className={styles.listColMobile}>{t('patients.mobile')}</span>
            <span className={styles.listColOps}>{t('patients.totalOperations')}</span>
            <span className={styles.listColDate}>{t('common.date')}</span>
          </div>
          {patients.map((patient) => (
            <PatientRow
              key={patient.id}
              patient={patient}
              onClick={() => handlePatientClick(patient.id)}
              onKeyDown={handleKeyDown(() => handlePatientClick(patient.id))}
            />
          ))}
        </div>
      </div>

      {/* ─── Pagination ───────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.paginationSection}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showLessItems
          />
        </div>
      )}
    </div>
  );
}
