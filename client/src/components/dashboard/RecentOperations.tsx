import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Table, Tag, Spin } from 'antd';
import {
  FileSearchOutlined,
  RightOutlined,
  CalendarOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { dashboardService } from '@/services/dashboard.service';
import { formatDate, getInitials, getStatusColor } from '@/utils/helpers';
import { OPERATION_STATUSES } from '@/utils/constants';
import type { Operation, OperationStatus } from '@/types';
import styles from './RecentOperations.module.scss';

// ─── Get status label from constants ───────────────
function getStatusLabel(status: OperationStatus): string {
  const found = OPERATION_STATUSES.find((s) => s.value === status);
  return found ? found.label : status;
}

// ─── Desktop Table Columns ─────────────────────────
function getColumns(t: (key: string) => string) {
  return [
    {
      title: t('patients.fullName'),
      dataIndex: ['patient', 'fullName'],
      key: 'patient',
      render: (_: unknown, record: Operation) => (
        <div className={styles.patientCell}>
          <div className={styles.patientAvatar}>
            {getInitials(record.patient?.fullName || '')}
          </div>
          <span className={styles.patientName}>
            {record.patient?.fullName || '—'}
          </span>
        </div>
      ),
    },
    {
      title: t('operations.operationName'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span className={styles.operationName}>{name}</span>
      ),
    },
    {
      title: t('operations.hospital'),
      dataIndex: ['hospital', 'name'],
      key: 'hospital',
      render: (name: string) => (
        <span className={styles.hospitalName}>{name || '—'}</span>
      ),
    },
    {
      title: t('common.date'),
      dataIndex: 'operationDate',
      key: 'date',
      width: 120,
      render: (date: string) => (
        <span className={styles.dateCell}>{formatDate(date)}</span>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: OperationStatus) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            borderRadius: 20,
            fontWeight: 500,
            fontSize: 12,
            padding: '2px 10px',
            margin: 0,
          }}
        >
          {getStatusLabel(status)}
        </Tag>
      ),
    },
  ];
}

// ─── Mobile Card ───────────────────────────────────
function MobileCard({ operation }: { operation: Operation }) {
  return (
    <Link
      to={`/operations/${operation.id}`}
      className={styles.mobileCard}
    >
      <div className={styles.mobileCardAvatar}>
        {getInitials(operation.patient?.fullName || '')}
      </div>
      <div className={styles.mobileCardContent}>
        <div className={styles.mobileCardTop}>
          <span className={styles.mobilePatientName}>
            {operation.patient?.fullName || '—'}
          </span>
          <Tag
            color={getStatusColor(operation.status)}
            style={{
              borderRadius: 20,
              fontWeight: 500,
              fontSize: 11,
              padding: '1px 8px',
              margin: 0,
              lineHeight: '20px',
            }}
          >
            {getStatusLabel(operation.status)}
          </Tag>
        </div>
        <span className={styles.mobileOperationName}>
          {operation.name}
        </span>
        <div className={styles.mobileCardMeta}>
          <span>
            <BankOutlined style={{ marginRight: 4 }} />
            {operation.hospital?.name || '—'}
          </span>
          <span className={styles.mobileCardDot} />
          <span>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {formatDate(operation.operationDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Component ─────────────────────────────────────
export default function RecentOperations() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'recentOperations'],
    queryFn: () => dashboardService.getRecentOperations(),
    select: (res) => res.data.data,
  });

  const operations = data ?? [];

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          {t('dashboard.recentOperations')}
        </h3>
        <Link to="/operations" className={styles.viewAllLink}>
          {t('dashboard.viewAll')}
          <RightOutlined style={{ fontSize: 11 }} />
        </Link>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Spin size="large" />
        </div>
      ) : operations.length === 0 ? (
        <div className={styles.emptyWrapper}>
          <FileSearchOutlined className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>
            {t('dashboard.noRecentOperations')}
          </p>
          <p className={styles.emptyDescription}>
            {t('common.noData')}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className={styles.tableWrapper}>
            <Table
              dataSource={operations}
              columns={getColumns(t)}
              rowKey="id"
              pagination={false}
              size="middle"
              onRow={(record) => ({
                className: styles.clickableRow,
                onClick: () => {
                  window.location.href = `/operations/${record.id}`;
                },
              })}
            />
          </div>

          {/* Mobile Cards */}
          <div className={styles.mobileList}>
            {operations.map((op) => (
              <MobileCard key={op.id} operation={op} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
