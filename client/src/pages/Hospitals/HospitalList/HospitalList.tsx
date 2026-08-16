import { useMemo } from 'react';
import {
  Table,
  Button,
  Empty,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Card,
  Spin,
  Pagination,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CalendarOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/helpers';
import type { Hospital } from '@/types';
import './HospitalList.scss';

export interface HospitalListProps {
  hospitals: Hospital[];
  isLoading?: boolean;
  hasSearch?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (hospital: Hospital) => void;
  onDelete: (id: string) => void;
}

export default function HospitalList({
  hospitals,
  isLoading = false,
  hasSearch = false,
  page,
  pageSize,
  total,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}: HospitalListProps) {
  const { t } = useTranslation();

  const getStatus = (hospital: Hospital) => {
    return hospital.isActive
      ? {
          label: t('common.active'),
          className: 'hospitalListStatusActive',
        }
      : {
          label: t('common.inactive'),
          className: 'hospitalListStatusInactive',
        };
  };

  const emptyNode = (
    <div className="hospitalListEmpty">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          hasSearch
            ? t('common.noResults')
            : t('hospitals.noHospitals')
        }
      >
        {!hasSearch && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            {t('hospitals.addHospital')}
          </Button>
        )}
      </Empty>
    </div>
  );

  const actionButtons = (hospital: Hospital) => (
    <div
      className="hospitalListActions"
      onClick={(event) => event.stopPropagation()}
    >
      <Tooltip title={t('common.edit')}>
        <Button
          type="text"
          size="small"
          className="hospitalListActionButton hospitalListEditButton"
          icon={<EditOutlined />}
          onClick={() => onEdit(hospital)}
          aria-label={t('common.edit')}
        />
      </Tooltip>

      <Popconfirm
        title={t('common.deleteConfirm')}
        description={hospital.name}
        onConfirm={() => onDelete(hospital.id)}
        okText={t('common.yes')}
        cancelText={t('common.no')}
        okButtonProps={{ danger: true }}
      >
        <Tooltip title={t('common.delete')}>
          <Button
            type="text"
            size="small"
            danger
            className="hospitalListActionButton hospitalListDeleteButton"
            icon={<DeleteOutlined />}
            aria-label={t('common.delete')}
          />
        </Tooltip>
      </Popconfirm>
    </div>
  );

  const columns: ColumnsType<Hospital> = useMemo(
    () => [
      {
        title: t('hospitals.hospitalName'),
        dataIndex: 'name',
        key: 'name',
        width: 280,
        ellipsis: true,
        render: (name: string, record) => {
          const status = getStatus(record);

          return (
            <div className="hospitalListNameCell">
              <div className="hospitalListIcon">
                <BankOutlined />
              </div>

              <div className="hospitalListNameContent">
                <div className="hospitalListNameRow">
                  <span className="hospitalListName">{name}</span>

                  <span className={`hospitalListStatus ${status.className}`}>
                    <span className="hospitalListStatusDot" />
                    {status.label}
                  </span>
                </div>

                <span className="hospitalListNameHint">
                  {record.city || t('hospitals.hospitalName')}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: t('hospitals.address'),
        key: 'address',
        ellipsis: true,
        render: (_, record) => {
          const address = [record.address, record.city]
            .filter(Boolean)
            .join(', ');

          return (
            <div className="hospitalListInfoCell">
              <EnvironmentOutlined />
              <Tooltip title={address || undefined}>
                <span>{address || '—'}</span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: t('hospitals.phone'),
        dataIndex: 'phone',
        key: 'phone',
        width: 170,
        render: (phone: string | null) => (
          <div className="hospitalListInfoCell hospitalListPhone">
            <PhoneOutlined />
            <span>{phone || '—'}</span>
          </div>
        ),
      },
      {
        title: t('common.date'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 145,
        render: (date: string) => (
          <div className="hospitalListInfoCell hospitalListDate">
            <CalendarOutlined />
            <span>{formatDate(date)}</span>
          </div>
        ),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 100,
        align: 'right',
        render: (_, record) => actionButtons(record),
      },
    ],
    [t, onEdit, onDelete],
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
    <div className="hospitalList">
      {/* Mobile */}
      <div className="hospitalListMobile">
        <Spin spinning={isLoading}>
          {hospitals.length === 0 && !isLoading ? (
            emptyNode
          ) : (
            <div className="hospitalListCards">
              {hospitals.map((hospital) => {
                const status = getStatus(hospital);

                const address = [hospital.address, hospital.city]
                  .filter(Boolean)
                  .join(', ');

                return (
                  <Card
                    key={hospital.id}
                    className="hospitalListCard"
                    bordered={false}
                    hoverable
                    onClick={() => onEdit(hospital)}
                  >
                    <div className="hospitalListCardHeader">
                      <div className="hospitalListCardIdentity">
                        <div className="hospitalListCardIcon">
                          <BankOutlined />
                        </div>

                        <div className="hospitalListCardTitle">
                          <h3>{hospital.name}</h3>

                          <span className="hospitalListCardSubtitle">
                            {hospital.city || '—'}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`hospitalListStatus ${status.className}`}
                      >
                        <span className="hospitalListStatusDot" />
                        {status.label}
                      </span>
                    </div>

                    <div className="hospitalListCardDivider" />

                    <div className="hospitalListCardDetails">
                      <div className="hospitalListCardDetail">
                        <div className="hospitalListCardDetailIcon">
                          <EnvironmentOutlined />
                        </div>

                        <div>
                          <span className="hospitalListCardDetailLabel">
                            {t('hospitals.address')}
                          </span>

                          <span className="hospitalListCardDetailValue">
                            {address || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="hospitalListCardDetail">
                        <div className="hospitalListCardDetailIcon">
                          <PhoneOutlined />
                        </div>

                        <div>
                          <span className="hospitalListCardDetailLabel">
                            {t('hospitals.phone')}
                          </span>

                          <span className="hospitalListCardDetailValue">
                            {hospital.phone || '—'}
                          </span>
                        </div>
                      </div>

                      {/* <div className="hospitalListCardDetail">
                        <div className="hospitalListCardDetailIcon">
                          <CalendarOutlined />
                        </div>

                        <div>
                          <span className="hospitalListCardDetailLabel">
                            {t('common.date')}
                          </span>

                          <span className="hospitalListCardDetailValue">
                            {formatDate(hospital.createdAt)}
                          </span>
                        </div>
                      </div> */}
                    </div>

                    <div className="hospitalListCardFooter">
                      <span className="hospitalListCardActionHint">
                        {t('common.edit')}
                      </span>

                      <div className="hospitalListCardArrow">
                        <RightOutlined />
                      </div>
                    </div>

                    <div
                      className="hospitalListMobileActions"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {actionButtons(hospital)}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Spin>

        {total > pageSize && (
          <div className="hospitalListMobilePagination">
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
      <div className="hospitalListDesktop">
        <Table<Hospital>
          className="hospitalListTable"
          rowKey="id"
          columns={columns}
          dataSource={hospitals}
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 780 }}
          onRow={(record) => ({
            onClick: () => onEdit(record),
            className: 'hospitalListRow',
          })}
          locale={{
            emptyText: emptyNode,
          }}
        />
      </div>
    </div>
  );
}