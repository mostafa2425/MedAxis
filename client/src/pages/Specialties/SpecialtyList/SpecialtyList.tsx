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
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/helpers';
import type { Specialty } from '@/types';
import './SpecialtyList.scss';

export interface SpecialtyListProps {
  specialties: Specialty[];
  isLoading?: boolean;
  hasSearch?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (specialty: Specialty) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

export default function SpecialtyList({
  specialties,
  isLoading = false,
  hasSearch = false,
  page,
  pageSize,
  total,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  readOnly = false,
}: SpecialtyListProps) {
  const { t } = useTranslation();

  const emptyNode = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={hasSearch ? t('common.noResults') : t('specialties.noSpecialties')}
    >
      {!hasSearch && !readOnly && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          {t('specialties.addSpecialty')}
        </Button>
      )}
    </Empty>
  );

  const actionButtons = (specialty: Specialty) => (
    <Space size={0}>
      <Tooltip title={t('common.edit')}>
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(specialty)}
        />
      </Tooltip>
      <Popconfirm
        title={t('common.deleteConfirm')}
        onConfirm={() => onDelete(specialty.id)}
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

  const columns: ColumnsType<Specialty> = useMemo(
    () => [
      {
        title: t('specialties.name'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        render: (name: string, record) => (
          <Space>
            <Tag
              icon={<TagOutlined />}
              color={record.color || undefined}
              style={record.color ? { color: '#fff' } : undefined}
            >
              {name}
            </Tag>
            {record.nameAr ? <span className="specialtyListNameAr">{record.nameAr}</span> : null}
          </Space>
        ),
      },
      {
        title: t('specialties.description'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        render: (description: string | null) => description || '—',
      },
      {
        title: t('specialties.totalDoctors'),
        key: 'doctors',
        width: 110,
        render: (_, record) => record._count?.doctors ?? 0,
      },
      {
        title: t('specialties.totalOperations'),
        key: 'operations',
        width: 120,
        render: (_, record) => record._count?.operations ?? 0,
      },
      {
        title: t('common.date'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 120,
        render: (date: string) => formatDate(date),
      },
      ...(readOnly
        ? []
        : [{
            title: t('common.actions'),
            key: 'actions',
            width: 100,
            align: 'center' as const,
            render: (_: unknown, record: Specialty) => actionButtons(record),
          }]),
    ],
    [t, onEdit, onDelete, readOnly],
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
      <div className="specialtyListMobile">
        <Spin spinning={isLoading}>
          {specialties.length === 0 && !isLoading ? (
            emptyNode
          ) : (
            <div className="specialtyListCards">
              {specialties.map((specialty) => (
                <Card
                  key={specialty.id}
                  className="specialtyListCard"
                  size="small"
                  title={
                    <Tag
                      icon={<TagOutlined />}
                      color={specialty.color || undefined}
                      style={specialty.color ? { color: '#fff' } : undefined}
                    >
                      {specialty.name}
                    </Tag>
                  }
                  extra={readOnly ? undefined : actionButtons(specialty)}
                >
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    {specialty.nameAr && (
                      <span className="specialtyListNameAr">{specialty.nameAr}</span>
                    )}
                    {specialty.description && (
                      <span className="specialtyListMeta">{specialty.description}</span>
                    )}
                    <span className="specialtyListMeta">
                      <TeamOutlined /> {t('specialties.totalDoctors')}:{' '}
                      {specialty._count?.doctors ?? 0}
                    </span>
                    <span className="specialtyListMeta">
                      <UserOutlined /> {t('specialties.totalOperations')}:{' '}
                      {specialty._count?.operations ?? 0}
                    </span>
                    <span className="specialtyListMeta">{formatDate(specialty.createdAt)}</span>
                  </Space>
                </Card>
              ))}
            </div>
          )}
        </Spin>
        {total > pageSize && (
          <div className="specialtyListMobilePagination">
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

      <div className="specialtyListDesktop">
        <Table<Specialty>
          className="specialtyListTable"
          rowKey="id"
          columns={columns}
          dataSource={specialties}
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 720 }}
          locale={{ emptyText: emptyNode }}
        />
      </div>
    </>
  );
}
