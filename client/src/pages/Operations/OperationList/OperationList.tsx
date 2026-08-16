import { useMemo } from 'react';
import {
  Table,
  Button,
  Empty,
  Tooltip,
  Card,
  Spin,
  Pagination,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  ClearOutlined,
  CalendarOutlined,
  BankOutlined,
  DollarOutlined,
  ScissorOutlined,
  UserOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import {
  formatCurrency,
  getStatusColor,
} from '@/utils/helpers';
import OperationSchedule from '@/components/OperationSchedule/OperationSchedule';
import { OPERATION_STATUSES } from '@/utils/constants';
import { OperationStatus, type Operation } from '@/types';

import './OperationList.scss';

function getStatusLabel(status: OperationStatus): string {
  return OPERATION_STATUSES.find((s) => s.value === status)?.label ?? status;
}

function getStatusBg(status: OperationStatus): string {
  return (
    OPERATION_STATUSES.find((s) => s.value === status)?.bg ??
    'rgba(148,163,184,0.1)'
  );
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
    <div className="operationListEmpty">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          hasFilters
            ? t('common.noResults')
            : t('operations.noOperations')
        }
      >
        {hasFilters && onClearFilters ? (
          <Button
            type="primary"
            icon={<ClearOutlined />}
            onClick={onClearFilters}
          >
            {t('common.clear')}
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            {t('operations.addOperation')}
          </Button>
        )}
      </Empty>
    </div>
  );

  const renderStatus = (status: OperationStatus) => (
    <span
      className="operationListStatus"
      style={{
        '--status-color': getStatusColor(status),
        '--status-bg': getStatusBg(status),
      } as React.CSSProperties}
    >
      <span className="operationListStatusDot" />
      <span>{getStatusLabel(status)}</span>
    </span>
  );

  const columns: ColumnsType<Operation> = useMemo(
    () => [
      {
        title: t('operations.operationName'),
        dataIndex: 'name',
        key: 'name',
        width: 260,
        ellipsis: true,
        render: (name: string, record) => (
          <div className="operationListNameCell">
            <div className="operationListOperationIcon">
              <ScissorOutlined />
            </div>

            <div className="operationListIdentity">
              <span className="operationListName">
                {name || '—'}
              </span>

              <span className="operationListPatient">
                <UserOutlined />
                {record.patient?.fullName ?? '—'}
              </span>
            </div>
          </div>
        ),
      },

      {
        title: t('operations.diagnosis'),
        dataIndex: 'diagnosis',
        key: 'diagnosis',
        width: 220,
        ellipsis: true,
        render: (diagnosis: string | null) => (
          <Tooltip title={diagnosis || undefined}>
            <span className="operationListDiagnosis">
              {diagnosis || '—'}
            </span>
          </Tooltip>
        ),
      },

      {
        title: t('operations.hospital'),
        key: 'hospital',
        width: 190,
        ellipsis: true,
        render: (_, record) => (
          <div className="operationListInfo">
            <span className="operationListInfoIcon">
              <BankOutlined />
            </span>

            <span className="operationListInfoText">
              {record.hospital?.name ?? '—'}
            </span>
          </div>
        ),
      },

      {
        title: t('operations.operationDate'),
        dataIndex: 'operationDate',
        key: 'operationDate',
        width: 150,
        render: (date: string, record) => (
          <div className="operationListInfo">
            <span className="operationListInfoIcon">
              <CalendarOutlined />
            </span>

            <span className="operationListInfoText operationListSchedule">
              <OperationSchedule date={date} time={record.operationTime} />
            </span>
          </div>
        ),
      },

      {
        title: t('operations.status'),
        dataIndex: 'status',
        key: 'status',
        width: 145,
        render: (status: OperationStatus) => renderStatus(status),
      },

      {
        title: t('operations.totalCost'),
        key: 'cost',
        width: 150,
        align: 'right',
        render: (_, record) => (
          <div className="operationListCost">
            <DollarOutlined />

            <span>
              {record.cost?.totalCost != null
                ? formatCurrency(record.cost.totalCost)
                : '—'}
            </span>
          </div>
        ),
      },

      {
        title: '',
        key: 'action',
        width: 48,
        align: 'center',
        render: () => (
          <span className="operationListAction">
            <RightOutlined />
          </span>
        ),
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
    <div className="operationList">
      {/* Mobile */}
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
                  bordered={false}
                  onClick={() => onRowClick(operation.id)}
                  styles={{
                    body: {
                      padding: 0,
                    },
                  }}
                >
                  <div className="operationListCardInner">
                    <div className="operationListCardHeader">
                      <div className="operationListCardTitle">
                        <div className="operationListOperationIcon">
                          <ScissorOutlined />
                        </div>

                        <div className="operationListCardIdentity">
                          <span className="operationListCardName">
                            {operation.name || '—'}
                          </span>

                          <span className="operationListCardPatient">
                            <UserOutlined />
                            {operation.patient?.fullName ?? '—'}
                          </span>
                        </div>
                      </div>

                      {renderStatus(operation.status)}
                    </div>

                    {/* {operation.diagnosis && (
                      <div className="operationListCardDiagnosis">
                        <span className="operationListCardDiagnosisLabel">
                          {t('operations.diagnosis')}
                        </span>

                        <Tooltip title={operation.diagnosis}>
                          <span className="operationListCardDiagnosisValue">
                            {operation.diagnosis}
                          </span>
                        </Tooltip>
                      </div>
                    )} */}

                    <div className="operationListCardMeta">
                      <div className="operationListCardMetaItem">
                        <span className="operationListCardMetaIcon">
                          <BankOutlined />
                        </span>

                        <span>
                          {operation.hospital?.name ?? '—'}
                        </span>
                      </div>

                      <div className="operationListCardMetaItem">
                        <span className="operationListCardMetaIcon">
                          <CalendarOutlined />
                        </span>

                        <span>
                          <OperationSchedule
                            date={operation.operationDate}
                            time={operation.operationTime}
                          />
                        </span>
                      </div>

                      <div className="operationListCardMetaItem operationListCardMetaItem--cost">
                        <span className="operationListCardMetaIcon">
                          <DollarOutlined />
                        </span>

                        <span>
                          {operation.cost?.totalCost != null
                            ? formatCurrency(operation.cost.totalCost)
                            : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="operationListCardFooter">
                      <span>
                        {t('common.viewDetails', 'View details')}
                      </span>

                      <RightOutlined />
                    </div>
                  </div>
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

      {/* Desktop */}
      <div className="operationListDesktop">
        <Table<Operation>
          className="operationListTable"
          rowKey="id"
          columns={columns}
          dataSource={operations}
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 1050 }}
          onRow={(record) => ({
            onClick: () => onRowClick(record.id),
          })}
          locale={{
            emptyText: emptyNode,
          }}
        />
      </div>
    </div>
  );
}