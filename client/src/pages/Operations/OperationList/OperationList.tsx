import { useMemo } from 'react';
import {
  Table,
  Button,
  Empty,
  Tag,
  Tooltip,
  Card,
  Spin,
  Pagination,
  Space,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  ClearOutlined,
  CalendarOutlined,
  BankOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from '@/utils/helpers';
import { OPERATION_STATUSES } from '@/utils/constants';
import { OperationStatus, type Operation } from '@/types';
import './OperationList.scss';

function getStatusLabel(status: OperationStatus): string {
  return OPERATION_STATUSES.find((s) => s.value === status)?.label ?? status;
}

function getStatusBg(status: OperationStatus): string {
  return OPERATION_STATUSES.find((s) => s.value === status)?.bg ?? 'rgba(148,163,184,0.1)';
}

export interface OperationListProps {
  operations: Operation[];
  isLoading?: boolean;
  hasFilters?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
  onAdd: () => void;
  onClearFilters?: () => void;
}

export default function OperationList({
  operations,
  isLoading = false,
  hasFilters = false,
  page,
  pageSize,
  total,
  onPageChange,
  onRowClick,
  onAdd,
  onClearFilters,
}: OperationListProps) {
  const { t } = useTranslation();

  const emptyNode = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={hasFilters ? t('common.noResults') : t('operations.noOperations')}
    >
      {hasFilters && onClearFilters ? (
        <Button type="primary" icon={<ClearOutlined />} onClick={onClearFilters}>
          {t('common.clear')}
        </Button>
      ) : (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          {t('operations.addOperation')}
        </Button>
      )}
    </Empty>
  );

  const columns: ColumnsType<Operation> = useMemo(
    () => [
      {
        title: t('operations.operationName'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        render: (name: string, record) => (
          <div className="operationListNameCell">
            <span className="operationListName">{name}</span>
            <span className="operationListPatient">{record.patient?.fullName ?? '—'}</span>
          </div>
        ),
      },
      {
        title: t('operations.diagnosis'),
        dataIndex: 'diagnosis',
        key: 'diagnosis',
        ellipsis: true,
        render: (diagnosis: string | null) => (
          <Tooltip title={diagnosis || undefined}>{diagnosis || '—'}</Tooltip>
        ),
      },
      {
        title: t('operations.hospital'),
        key: 'hospital',
        ellipsis: true,
        render: (_, record) => record.hospital?.name ?? '—',
      },
      {
        title: t('operations.operationDate'),
        dataIndex: 'operationDate',
        key: 'operationDate',
        width: 120,
        render: (date: string) => formatDate(date),
      },
      {
        title: t('operations.status'),
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (status: OperationStatus) => (
          <Tag color={getStatusBg(status)} style={{ color: getStatusColor(status) }}>
            {getStatusLabel(status)}
          </Tag>
        ),
      },
      {
        title: t('operations.totalCost'),
        key: 'cost',
        width: 120,
        align: 'right',
        render: (_, record) =>
          record.cost?.totalCost != null ? formatCurrency(record.cost.totalCost) : '—',
      },
    ],
    [t],
  );

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total,
    onChange: onPageChange,
    showSizeChanger: false,
    showLessItems: true,
    hideOnSinglePage: true,
  };

  return (
    <>
      <div className="operationListMobile">
        <Spin spinning={isLoading}>
          {operations.length === 0 && !isLoading ? (
            emptyNode
          ) : (
            <div className="operationListCards">
              {operations.map((operation) => (
                <Card
                  key={operation.id}
                  className="operationListCard"
                  size="small"
                  hoverable
                  onClick={() => onRowClick(operation.id)}
                  title={operation.name}
                  extra={
                    <Tag
                      color={getStatusBg(operation.status)}
                      style={{ color: getStatusColor(operation.status) }}
                    >
                      {getStatusLabel(operation.status)}
                    </Tag>
                  }
                >
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <span className="operationListPatient">
                      {operation.patient?.fullName ?? '—'}
                    </span>
                    {operation.diagnosis && (
                      <span className="operationListMeta">{operation.diagnosis}</span>
                    )}
                    <span className="operationListMeta">
                      <BankOutlined /> {operation.hospital?.name ?? '—'}
                    </span>
                    <span className="operationListMeta">
                      <CalendarOutlined /> {formatDate(operation.operationDate)}
                    </span>
                    <span className="operationListMeta">
                      <DollarOutlined />{' '}
                      {operation.cost?.totalCost != null
                        ? formatCurrency(operation.cost.totalCost)
                        : '—'}
                    </span>
                  </Space>
                </Card>
              ))}
            </div>
          )}
        </Spin>
        {total > pageSize && (
          <div className="operationListMobilePagination">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={onPageChange}
              showSizeChanger={false}
              showLessItems
              size="small"
            />
          </div>
        )}
      </div>

      <div className="operationListDesktop">
        <Table<Operation>
          className="operationListTable"
          rowKey="id"
          columns={columns}
          dataSource={operations}
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 800 }}
          onRow={(record) => ({
            onClick: () => onRowClick(record.id),
            style: { cursor: 'pointer' },
          })}
          locale={{ emptyText: emptyNode }}
        />
      </div>
    </>
  );
}
