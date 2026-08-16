import { useState, useCallback, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Input,
  Empty,
  Tooltip,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import { specialtyService } from '@/services/specialty.service';
import { useDebounce } from '@/hooks/useDebounce';
import { OPERATION_STATUSES, DEFAULT_PAGINATION } from '@/utils/constants';
import { OperationStatus, type Operation, type Specialty } from '@/types';
import dayjs from 'dayjs';
import OperationList from './OperationList/OperationList';
import './Operations.scss';

const { RangePicker } = DatePicker;

export default function OperationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OperationStatus | undefined>();
  const [specialtyFilter, setSpecialtyFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);

  const debouncedSearch = useDebounce(search, 350);

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
  const total = pagination?.total ?? operations.length;
  const specialties: Specialty[] = specialtiesData?.data?.data ?? [];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter(undefined);
    setSpecialtyFilter(undefined);
    setDateRange(null);
    setPage(1);
  }, []);

  const hasActiveFilters = Boolean(
    debouncedSearch || statusFilter || specialtyFilter || dateRange,
  );

  if (isError) {
    return (
      <div className="operations-page page">
        <div className="pageHeader">
          <div className="pageHeaderLeft">
            <h1 className="pageTitle">{t('operations.title')}</h1>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/operations/new')}
          >
            {t('operations.addOperation')}
          </Button>
        </div>
        <Empty
          className="emptyState"
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

  return (
    <div className="operations-page page">
      <div className="pageHeader">
        <div className="pageHeaderLeft">
          <h1 className="pageTitle">{t('operations.title')}</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/operations/new')}
        >
          {t('operations.addOperation')}
        </Button>
      </div>

      <div className="filtersSection">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} lg={6} xl={5}>
            <Input
              prefix={<SearchOutlined />}
              placeholder={t('operations.searchPlaceholder')}
              size="large"
              value={search}
              onChange={handleSearchChange}
              allowClear
              disabled={isLoading}
            />
          </Col>
          <Col xs={12} sm={12} lg={5} xl={4}>
            <Select
              placeholder={t('operations.allStatuses')}
              size="large"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
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
              onChange={(value) => {
                setSpecialtyFilter(value);
                setPage(1);
              }}
              allowClear
              showSearch
              optionFilterProp="label"
              options={specialties
                .filter((s) => !s.parentId)
                .map((s) => ({
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
              onChange={(dates) => {
                setDateRange(dates);
                setPage(1);
              }}
              style={{ width: '100%' }}
              placeholder={[t('operations.dateFrom'), t('operations.dateTo')]}
            />
          </Col>
          {hasActiveFilters && (
            <Col xs={12} sm={12} lg={2} xl={2}>
              <Tooltip title={t('common.clear')}>
                <Button icon={<ClearOutlined />} onClick={handleClearFilters} block />
              </Tooltip>
            </Col>
          )}
        </Row>
      </div>

      {!isLoading && (
        <div className="resultsCount">
          <span>
            {t('common.showing')} {operations.length}{' '}
            {t('common.results').toLowerCase()}
            {pagination && (
              <span className="resultsTotal">
                {' '}
                ({t('common.total')}: {pagination.total})
              </span>
            )}
          </span>
        </div>
      )}

      <OperationList
        operations={operations}
        isLoading={isLoading}
        hasFilters={hasActiveFilters}
        page={page}
        pageSize={DEFAULT_PAGINATION.limit}
        total={total}
        onPageChange={setPage}
        onRowClick={(id) => navigate(`/operations/${id}`)}
        onAdd={() => navigate('/operations/new')}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
