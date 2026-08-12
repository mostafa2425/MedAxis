import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Input,
  Tag,
  Pagination,
  Skeleton,
  Empty,
  Tooltip,
  Select,
  DatePicker,
  Space,
  Row,
  Col,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  BankOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  FilterOutlined,
  DollarOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import { specialtyService } from '@/services/specialty.service';
import { useDebounce } from '@/hooks/useDebounce';
import {
  formatCurrency,
  formatDate,
  formatTime,
  getStatusColor,
} from '@/utils/helpers';
import {
  OPERATION_STATUSES,
  DEFAULT_PAGINATION,
} from '@/utils/constants';
import {
  OperationStatus,
  type Operation,
  type Specialty,
} from '@/types';
import dayjs from 'dayjs';
import styles from './OperationsPage.module.scss';

const { RangePicker } = DatePicker;

// ═══════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════

function getStatusLabel(status: OperationStatus): string {
  const found = OPERATION_STATUSES.find((s) => s.value === status);
  return found?.label ?? status;
}

function getStatusBg(status: OperationStatus): string {
  const found = OPERATION_STATUSES.find((s) => s.value === status);
  return found?.bg ?? 'rgba(148,163,184,0.1)';
}

function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ═══════════════════════════════════════════════════════
// Skeleton Components
// ═══════════════════════════════════════════════════════

function SkeletonCard() {
  return (
    <div className={styles.operationCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderInfo}>
          <Skeleton.Input active size="small" style={{ width: 180, height: 20 }} />
          <Skeleton.Input active size="small" style={{ width: 120, height: 14, marginTop: 8 }} />
        </div>
        <Skeleton.Avatar active size={32} shape="square" />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <Skeleton.Input active size="small" style={{ width: 100, height: 14 }} />
          <Skeleton.Input active size="small" style={{ width: 140, height: 14 }} />
        </div>
        <div className={styles.cardMeta}>
          <Skeleton.Input active size="small" style={{ width: 110, height: 14 }} />
          <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
        </div>
      </div>
      <div className={styles.cardFooter}>
        <Skeleton.Input active size="small" style={{ width: 90, height: 16 }} />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className={styles.operationRow}>
      <div className={styles.rowMain}>
        <Skeleton.Avatar active size={36} shape="square" />
        <div className={styles.rowInfo}>
          <Skeleton.Input active size="small" style={{ width: 180, height: 18 }} />
          <Skeleton.Input active size="small" style={{ width: 140, height: 14, marginTop: 6 }} />
        </div>
      </div>
      <div className={styles.rowDetails}>
        <Skeleton.Input active size="small" style={{ width: 70, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 90, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 100, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 90, height: 14 }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Operation Card (Mobile)
// ═══════════════════════════════════════════════════════

function OperationCard({
  operation,
  onClick,
  onKeyDown,
}: {
  operation: Operation;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={styles.operationCard}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderInfo}>
          <span className={styles.operationName}>{operation.name}</span>
          <span className={styles.patientName}>
            <UserOutlined className={styles.metaIcon} />
            {operation.patient?.fullName ?? '—'}
          </span>
        </div>
        <Tag
          className={styles.statusTag}
          color={getStatusBg(operation.status)}
          style={{ color: getStatusColor(operation.status) }}
        >
          {getStatusLabel(operation.status)}
        </Tag>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            <MedicineBoxOutlined className={styles.metaIcon} />
            {operation.diagnosis ?? '—'}
          </span>
          <span className={styles.metaItem}>
            <CalendarOutlined className={styles.metaIcon} />
            {formatDate(operation.operationDate)}
          </span>
        </div>
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            <BankOutlined className={styles.metaIcon} />
            {operation.hospital?.name ?? '—'}
          </span>
          {operation.duration && (
            <span className={styles.metaItem}>
              {formatDuration(operation.duration)}
            </span>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.costBadge}>
          <DollarOutlined className={styles.costIcon} />
          {operation.cost?.totalCost
            ? formatCurrency(operation.cost.totalCost)
            : '—'}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Operation Row (Desktop)
// ═══════════════════════════════════════════════════════

function OperationRow({
  operation,
  onClick,
  onKeyDown,
}: {
  operation: Operation;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={styles.operationRow}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.rowMain}>
        <div className={styles.rowAvatar}>
          <MedicineBoxOutlined />
        </div>
        <div className={styles.rowInfo}>
          <span className={styles.operationName}>{operation.name}</span>
          <span className={styles.patientNameSmall}>
            <UserOutlined className={styles.metaIcon} />
            {operation.patient?.fullName ?? '—'}
          </span>
        </div>
      </div>

      <div className={styles.rowDetails}>
        <span className={styles.diagnosisCell}>
          <Tooltip title={operation.diagnosis}>
            <span>{operation.diagnosis ?? '—'}</span>
          </Tooltip>
        </span>

        <span className={styles.rowMetaItem}>
          <BankOutlined className={styles.metaIcon} />
          {operation.hospital?.name ?? '—'}
        </span>

        <span className={styles.rowMetaItem}>
          <CalendarOutlined className={styles.metaIcon} />
          {formatDate(operation.operationDate)}
        </span>

        <Tag
          className={styles.statusTagSmall}
          color={getStatusBg(operation.status)}
          style={{ color: getStatusColor(operation.status) }}
        >
          {getStatusLabel(operation.status)}
        </Tag>

        <span className={styles.costCell}>
          {operation.cost?.totalCost
            ? formatCurrency(operation.cost.totalCost)
            : '—'}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Operations List Page
// ═══════════════════════════════════════════════════════

export default function OperationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // ── Filter State ────────────────────────────────
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OperationStatus | undefined>(undefined);
  const [specialtyFilter, setSpecialtyFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);

  const debouncedSearch = useDebounce(search, 350);

  // ── Queries ──────────────────────────────────────
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      'operations',
      page,
      debouncedSearch,
      statusFilter,
      specialtyFilter,
      dateRange?.[0]?.toISOString(),
      dateRange?.[1]?.toISOString(),
    ],
    queryFn: () =>
      operationService.getAll({
        page,
        limit: DEFAULT_PAGINATION.limit,
        search: debouncedSearch || undefined,
        status: statusFilter,
        specialtyId: specialtyFilter,
        dateFrom: dateRange?.[0]?.format('YYYY-MM-DD') ?? undefined,
        dateTo: dateRange?.[1]?.format('YYYY-MM-DD') ?? undefined,
        sortBy: 'operationDate',
        sortOrder: 'desc',
      }),
  });

  const { data: specialtiesData } = useQuery({
    queryKey: ['specialties-list'],
    queryFn: () => specialtyService.getAll({ limit: 100 }),
  });

  const operations: Operation[] = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];

  // ── Handlers ────────────────────────────────────
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    [],
  );

  const handleStatusChange = useCallback((value: OperationStatus | undefined) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleSpecialtyChange = useCallback((value: string | undefined) => {
    setSpecialtyFilter(value);
    setPage(1);
  }, []);

  const handleDateRangeChange = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      setDateRange(dates);
      setPage(1);
    },
    [],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleOperationClick = useCallback(
    (id: string) => () => {
      navigate(`/operations/${id}`);
    },
    [navigate],
  );

  const handleKeyDown =
    (callback: () => void) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
      }
    };

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter(undefined);
    setSpecialtyFilter(undefined);
    setDateRange(null);
    setPage(1);
  }, []);

  const hasActiveFilters =
    debouncedSearch || statusFilter || specialtyFilter || dateRange;

  // ─── Loading State ───────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.page}>
        {contextHolder}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('operations.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            disabled
          >
            {t('operations.addOperation')}
          </Button>
        </div>

        <div className={styles.filtersSection}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} lg={6}>
              <Skeleton.Input active size="large" style={{ width: '100%', height: 40 }} block />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Skeleton.Input active size="large" style={{ width: '100%', height: 40 }} block />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Skeleton.Input active size="large" style={{ width: '100%', height: 40 }} block />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Skeleton.Input active size="large" style={{ width: '100%', height: 40 }} block />
            </Col>
          </Row>
        </div>

        <div className={styles.mobileView}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className={styles.desktopView}>
          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              <span className={styles.listColOperation}>{t('operations.operationName')}</span>
              <span className={styles.listColDiagnosis}>{t('operations.diagnosis')}</span>
              <span className={styles.listColHospital}>{t('operations.hospital')}</span>
              <span className={styles.listColDate}>{t('operations.operationDate')}</span>
              <span className={styles.listColStatus}>{t('operations.status')}</span>
              <span className={styles.listColCost}>{t('operations.totalCost')}</span>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────
  if (isError) {
    return (
      <div className={styles.page}>
        {contextHolder}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('operations.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/operations/new')}
          >
            {t('operations.addOperation')}
          </Button>
        </div>

        <Empty
          className={styles.emptyState}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.operationFailed')}
        >
          <Button type="primary" onClick={() => refetch()}>
            {t('common.refresh')}
          </Button>
        </Empty>
      </div>
    );
  }

  // ─── Empty State ─────────────────────────────────
  if (operations.length === 0) {
    return (
      <div className={styles.page}>
        {contextHolder}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{t('operations.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/operations/new')}
          >
            {t('operations.addOperation')}
          </Button>
        </div>

        <div className={styles.filtersSection}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} lg={6}>
              <Input
                prefix={<SearchOutlined />}
                placeholder={t('operations.searchPlaceholder')}
                size="large"
                value={search}
                onChange={handleSearchChange}
                allowClear
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <Select
                placeholder={t('operations.allStatuses')}
                size="large"
                value={statusFilter}
                onChange={handleStatusChange}
                allowClear
                options={OPERATION_STATUSES.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <Select
                placeholder={t('operations.allSpecialties')}
                size="large"
                value={specialtyFilter}
                onChange={handleSpecialtyChange}
                allowClear
                showSearch
                optionFilterProp="label"
                options={specialties.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <RangePicker
                size="large"
                value={dateRange}
                onChange={handleDateRangeChange}
                style={{ width: '100%' }}
                placeholder={[t('operations.dateFrom'), t('operations.dateTo')]}
              />
            </Col>
          </Row>
        </div>

        <Empty
          className={styles.emptyState}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            hasActiveFilters
              ? t('common.noResults')
              : t('operations.noOperations')
          }
        >
          {hasActiveFilters ? (
            <Button type="primary" icon={<ClearOutlined />} onClick={handleClearFilters}>
              {t('common.clear')}
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/operations/new')}
            >
              {t('operations.addOperation')}
            </Button>
          )}
        </Empty>
      </div>
    );
  }

  // ─── Main Content ────────────────────────────────
  return (
    <div className={styles.page}>
      {contextHolder}

      {/* ─── Page Header ──────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>{t('operations.title')}</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/operations/new')}
        >
          {t('operations.addOperation')}
        </Button>
      </div>

      {/* ─── Filters ──────────────────────────────── */}
      <div className={styles.filtersSection}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} lg={6} xl={5}>
            <Input
              prefix={<SearchOutlined />}
              placeholder={t('operations.searchPlaceholder')}
              size="large"
              value={search}
              onChange={handleSearchChange}
              allowClear
            />
          </Col>
          <Col xs={12} sm={12} lg={5} xl={4}>
            <Select
              placeholder={t('operations.allStatuses')}
              size="large"
              value={statusFilter}
              onChange={handleStatusChange}
              allowClear
              options={OPERATION_STATUSES.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={12} lg={5} xl={4}>
            <Select
              placeholder={t('operations.allSpecialties')}
              size="large"
              value={specialtyFilter}
              onChange={handleSpecialtyChange}
              allowClear
              showSearch
              optionFilterProp="label"
              options={specialties.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={7} xl={5}>
            <RangePicker
              size="large"
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
              placeholder={[t('operations.dateFrom'), t('operations.dateTo')]}
            />
          </Col>
          {hasActiveFilters && (
            <Col xs={12} sm={12} lg={2} xl={2}>
              <Tooltip title={t('common.clear')}>
                <Button
                  size="large"
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  block
                />
              </Tooltip>
            </Col>
          )}
        </Row>
      </div>

      {/* ─── Results Count ────────────────────────── */}
      <div className={styles.resultsCount}>
        <span>
          {t('common.showing')} {operations.length}{' '}
          {t('common.results').toLowerCase()}
          {pagination && (
            <span className={styles.resultsTotal}>
              {' '}
              ({t('common.total')}: {pagination.total})
            </span>
          )}
        </span>
      </div>

      {/* ─── Mobile Cards View ────────────────────── */}
      <div className={styles.mobileView}>
        {operations.map((op) => (
          <OperationCard
            key={op.id}
            operation={op}
            onClick={handleOperationClick(op.id)}
            onKeyDown={handleKeyDown(handleOperationClick(op.id))}
          />
        ))}
      </div>

      {/* ─── Desktop List View ─────────────────────── */}
      <div className={styles.desktopView}>
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <span className={styles.listColOperation}>
              {t('operations.operationName')}
            </span>
            <span className={styles.listColDiagnosis}>
              {t('operations.diagnosis')}
            </span>
            <span className={styles.listColHospital}>
              {t('operations.hospital')}
            </span>
            <span className={styles.listColDate}>
              {t('operations.operationDate')}
            </span>
            <span className={styles.listColStatus}>
              {t('operations.status')}
            </span>
            <span className={styles.listColCost}>
              {t('operations.totalCost')}
            </span>
          </div>
          {operations.map((op) => (
            <OperationRow
              key={op.id}
              operation={op}
              onClick={handleOperationClick(op.id)}
              onKeyDown={handleKeyDown(handleOperationClick(op.id))}
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
