import { useMemo } from 'react';
import {
  Table,
  Button,
  Empty,
  Space,
  Tag,
  Avatar,
  Card,
  Spin,
  Pagination,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PlusOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getInitials } from '@/utils/helpers';
import { Gender, type Patient } from '@/types';
import './PatientList.scss';

export interface PatientListProps {
  patients: Patient[];
  isLoading?: boolean;
  hasSearch?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
  onAdd: () => void;
}

export default function PatientList({
  patients,
  isLoading = false,
  hasSearch = false,
  page,
  pageSize,
  total,
  onPageChange,
  onRowClick,
  onAdd,
}: PatientListProps) {
  const { t } = useTranslation();

  const emptyNode = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={hasSearch ? t('common.noResults') : t('patients.noPatients')}
    >
      {!hasSearch && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          {t('patients.addPatient')}
        </Button>
      )}
    </Empty>
  );

  const columns: ColumnsType<Patient> = useMemo(
    () => [
      {
        title: t('patients.fullName'),
        dataIndex: 'fullName',
        key: 'fullName',
        ellipsis: true,
        render: (fullName: string, record) => (
          <Space>
            <Avatar
              size={36}
              className={
                record.gender === Gender.Male
                  ? 'patientListAvatar patientListAvatarMale'
                  : 'patientListAvatar patientListAvatarFemale'
              }
            >
              {getInitials(fullName)}
            </Avatar>
            <div className="patientListNameCell">
              <span className="patientListName">{fullName}</span>
              <span className="patientListAge">
                {record.age} {t('common.age')}
              </span>
            </div>
          </Space>
        ),
      },
      {
        title: t('patients.gender'),
        dataIndex: 'gender',
        key: 'gender',
        width: 110,
        render: (gender: Gender) => (
          <Tag color={gender === Gender.Male ? 'blue' : 'magenta'}>
            {gender === Gender.Male ? t('patients.male') : t('patients.female')}
          </Tag>
        ),
      },
      {
        title: t('patients.mobile'),
        dataIndex: 'mobile',
        key: 'mobile',
        render: (mobile: string | null) => mobile || '—',
      },
      {
        title: t('patients.totalOperations'),
        key: 'operations',
        width: 120,
        align: 'center',
        render: (_, record) => record._count?.operations ?? 0,
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
      <div className="patientListMobile">
        <Spin spinning={isLoading}>
          {patients.length === 0 && !isLoading ? (
            emptyNode
          ) : (
            <div className="patientListCards">
              {patients.map((patient) => (
                <Card
                  key={patient.id}
                  className="patientListCard"
                  size="small"
                  hoverable
                  onClick={() => onRowClick(patient.id)}
                  title={
                    <Space>
                      <Avatar
                        size={28}
                        className={
                          patient.gender === Gender.Male
                            ? 'patientListAvatar patientListAvatarMale'
                            : 'patientListAvatar patientListAvatarFemale'
                        }
                      >
                        {getInitials(patient.fullName)}
                      </Avatar>
                      <span>{patient.fullName}</span>
                    </Space>
                  }
                  extra={
                    <Tag color={patient.gender === Gender.Male ? 'blue' : 'magenta'}>
                      {patient.gender === Gender.Male
                        ? t('patients.male')
                        : t('patients.female')}
                    </Tag>
                  }
                >
                  <Space direction="vertical" size={6} className="patientListCardBody">
                    <span className="patientListAge">
                      {patient.age} {t('common.age')}
                    </span>
                    <span className="patientListMeta">
                      <PhoneOutlined /> {patient.mobile || '—'}
                    </span>
                    <span className="patientListMeta">
                      <TeamOutlined />{' '}
                      {t('patients.operationsCount', {
                        count: patient._count?.operations ?? 0,
                      })}
                    </span>
                  </Space>
                </Card>
              ))}
            </div>
          )}
        </Spin>
        {total > pageSize && (
          <div className="patientListMobilePagination">
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

      <div className="patientListDesktop">
        <Table<Patient>
          className="patientListTable"
          rowKey="id"
          columns={columns}
          dataSource={patients}
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 640 }}
          onRow={(record) => ({
            onClick: () => onRowClick(record.id),
            className: 'patientListRow',
          })}
          locale={{ emptyText: emptyNode }}
        />
      </div>
    </>
  );
}
