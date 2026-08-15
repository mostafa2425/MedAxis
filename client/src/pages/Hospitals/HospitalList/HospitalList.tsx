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

  const emptyNode = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={hasSearch ? t('common.noResults') : t('hospitals.noHospitals')}
    >
      {!hasSearch && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          {t('hospitals.addHospital')}
        </Button>
      )}
    </Empty>
  );

  const actionButtons = (hospital: Hospital) => (
    <Space size={0}>
      <Tooltip title={t('common.edit')}>
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(hospital)}
        />
      </Tooltip>
      <Popconfirm
        title={t('common.deleteConfirm')}
        onConfirm={() => onDelete(hospital.id)}
        okText={t('common.yes')}
        cancelText={t('common.no')}
        okButtonProps={{ danger: true }}
      >
        <Tooltip title={t('common.delete')}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Tooltip>
      </Popconfirm>
    </Space>
  );

  const columns: ColumnsType<Hospital> = useMemo(
    () => [
      {
        title: t('hospitals.hospitalName'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        render: (name: string, record) => (
          <Space>
            <BankOutlined className="hospitalListNameIcon" />
            <span>{name}</span>
            <Tag color={record.isActive ? 'success' : 'default'}>
              {record.isActive ? t('common.active') : t('common.inactive')}
            </Tag>
          </Space>
        ),
      },
      {
        title: t('hospitals.address'),
        key: 'address',
        ellipsis: true,
        render: (_, record) =>
          [record.address, record.city].filter(Boolean).join(', ') || '—',
      },
      {
        title: t('hospitals.phone'),
        dataIndex: 'phone',
        key: 'phone',
        render: (phone: string | null) => phone || '—',
      },
      {
        title: t('common.date'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 120,
        render: (date: string) => formatDate(date),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 100,
        align: 'center',
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
    <>
      <div className="hospitalListMobile">
        <Spin spinning={isLoading}>
          {hospitals.length === 0 && !isLoading ? (
            emptyNode
          ) : (
            <div className="hospitalListCards">
              {hospitals.map((hospital) => (
                <Card
                  key={hospital.id}
                  className="hospitalListCard"
                  size="small"
                  title={
                    <Space>
                      <BankOutlined className="hospitalListNameIcon" />
                      <span>{hospital.name}</span>
                    </Space>
                  }
                  extra={actionButtons(hospital)}
                >
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Tag color={hospital.isActive ? 'success' : 'default'}>
                      {hospital.isActive ? t('common.active') : t('common.inactive')}
                    </Tag>
                    <span className="hospitalListMeta">
                      <EnvironmentOutlined />{' '}
                      {[hospital.address, hospital.city].filter(Boolean).join(', ') || '—'}
                    </span>
                    <span className="hospitalListMeta">
                      <PhoneOutlined /> {hospital.phone || '—'}
                    </span>
                    <span className="hospitalListMeta">{formatDate(hospital.createdAt)}</span>
                  </Space>
                </Card>
              ))}
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

      <div className="hospitalListDesktop">
        <Table<Hospital>
          className="hospitalListTable"
          rowKey="id"
          columns={columns}
          dataSource={hospitals}
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 640 }}
          locale={{ emptyText: emptyNode }}
        />
      </div>
    </>
  );
}
