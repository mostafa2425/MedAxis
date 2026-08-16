import { useMemo } from 'react';
import {
  Table,
  Button,
  Empty,
  Tag,
  Avatar,
  Card,
  Spin,
  Pagination,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
  RightOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
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

  const getGenderLabel = (gender: Gender) =>
    gender === Gender.Male
      ? t('patients.male')
      : t('patients.female');

  const getGenderClass = (gender: Gender) =>
    gender === Gender.Male
      ? 'patientListGender--male'
      : 'patientListGender--female';

  const emptyNode = (
    <div className="patientListEmpty">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          hasSearch
            ? t('common.noResults')
            : t('patients.noPatients')
        }
      >
        {!hasSearch && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            {t('patients.addPatient')}
          </Button>
        )}
      </Empty>
    </div>
  );

  const renderPatientIdentity = (
    fullName: string,
    patient: Patient,
    size: number = 42,
  ) => (
    <div className="patientListIdentity">
      <Avatar
        size={size}
        className={
          patient.gender === Gender.Male
            ? 'patientListAvatar patientListAvatarMale'
            : 'patientListAvatar patientListAvatarFemale'
        }
      >
        {getInitials(fullName)}
      </Avatar>

      <div className="patientListIdentityContent">
        <span className="patientListName">
          {fullName || '—'}
        </span>

        <span className="patientListAge">
          <CalendarOutlined />
          {patient.age} {t('common.age')}
        </span>
      </div>
    </div>
  );

  const renderGender = (gender: Gender) => (
    <span
      className={`patientListGender ${getGenderClass(gender)}`}
    >
      <span className="patientListGenderDot" />
      {getGenderLabel(gender)}
    </span>
  );

  const columns: ColumnsType<Patient> = useMemo(
    () => [
      {
        title: t('patients.fullName'),
        dataIndex: 'fullName',
        key: 'fullName',
        width: 280,
        ellipsis: true,
        render: (fullName: string, record) =>
          renderPatientIdentity(fullName, record, 44),
      },

      {
        title: t('patients.gender'),
        dataIndex: 'gender',
        key: 'gender',
        width: 130,
        render: (gender: Gender) => renderGender(gender),
      },

      {
        title: t('patients.mobile'),
        dataIndex: 'mobile',
        key: 'mobile',
        width: 190,
        render: (mobile: string | null) => (
          <div className="patientListInfo">
            <span className="patientListInfoIcon">
              <PhoneOutlined />
            </span>

            <span className="patientListInfoText">
              {mobile || '—'}
            </span>
          </div>
        ),
      },

      {
        title: t('patients.totalOperations'),
        key: 'operations',
        width: 170,
        align: 'center',
        render: (_, record) => {
          const count = record._count?.operations ?? 0;

          return (
            <div className="patientListOperations">
              <span className="patientListOperationsIcon">
                <TeamOutlined />
              </span>

              <div className="patientListOperationsContent">
                <span className="patientListOperationsCount">
                  {count}
                </span>

                <span className="patientListOperationsLabel">
                  {t('patients.totalOperations')}
                </span>
              </div>
            </div>
          );
        },
      },

      {
        title: '',
        key: 'action',
        width: 52,
        align: 'center',
        render: () => (
          <span className="patientListAction">
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
    <div className="patientList">
      {/* =====================================================
          Mobile
          ===================================================== */}
      <div className="patientListMobile">
        <Spin spinning={isLoading}>
          {patients.length === 0 && !isLoading ? (
            emptyNode
          ) : (
            <div className="patientListCards">
              {patients.map((patient) => {
                const operationsCount =
                  patient._count?.operations ?? 0;

                return (
                  <Card
                    key={patient.id}
                    className="patientListCard"
                    bordered={false}
                    onClick={() => onRowClick(patient.id)}
                    styles={{
                      body: {
                        padding: 0,
                      },
                    }}
                  >
                    <div className="patientListCardInner">
                      <div className="patientListCardHeader">
                        {renderPatientIdentity(
                          patient.fullName,
                          patient,
                          48,
                        )}

                        {renderGender(patient.gender)}
                      </div>

                      <div className="patientListCardMeta">
                        <div className="patientListCardMetaItem">
                          <span className="patientListCardMetaIcon">
                            <PhoneOutlined />
                          </span>

                          <div className="patientListCardMetaContent">
                            <span className="patientListCardMetaLabel">
                              {t('patients.mobile')}
                            </span>

                            <span className="patientListCardMetaValue">
                              {patient.mobile || '—'}
                            </span>
                          </div>
                        </div>

                        <div className="patientListCardMetaItem">
                          <span className="patientListCardMetaIcon">
                            <TeamOutlined />
                          </span>

                          <div className="patientListCardMetaContent">
                            <span className="patientListCardMetaLabel">
                              {t('patients.totalOperations')}
                            </span>

                            <span className="patientListCardMetaValue">
                              {t('patients.operationsCount', {
                                count: operationsCount,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="patientListCardFooter">
                        <span>
                          {t('common.viewDetails', 'View details')}
                        </span>

                        <RightOutlined />
                      </div>
                    </div>
                  </Card>
                );
              })}
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

      {/* =====================================================
          Desktop
          ===================================================== */}
      <div className="patientListDesktop">
        <Table<Patient>
          className="patientListTable"
          rowKey="id"
          columns={columns}
          dataSource={patients}
          loading={isLoading}
          pagination={pagination}
          scroll={{ x: 760 }}
          onRow={(record) => ({
            onClick: () => onRowClick(record.id),
            className: 'patientListRow',
          })}
          locale={{
            emptyText: emptyNode,
          }}
        />
      </div>
    </div>
  );
}