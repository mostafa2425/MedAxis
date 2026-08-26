import { useMemo, type ReactNode } from 'react';
import { Button, Card, Empty, Pagination, Select, Spin, Tag } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  PhoneOutlined,
  RightOutlined,
  ScissorOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getInitials } from '@/utils/helpers';
import { Gender, type OperationCatalogItem, type Patient } from '@/types';
import PhoneLink from '@/components/common/PhoneLink';
import './PatientList.scss';
import './PatientManagement.scss';

export interface PatientListProps {
  patients: Patient[];
  isLoading?: boolean;
  hasSearch?: boolean;
  page: number;
  pageSize: number;
  total: number;
  gender?: Gender;
  surgicalProcedureId?: string;
  surgicalProcedures?: OperationCatalogItem[];
  isLoadingSurgicalProcedures?: boolean;
  onGenderChange?: (gender?: Gender) => void;
  onSurgicalProcedureChange?: (id?: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
  onAdd: () => void;
}

function Stat({ icon, value, label, tone }: { icon: ReactNode; value: number; label: string; tone: string }) {
  return (
    <div className={`patientManagementStat patientManagementStat--${tone}`}>
      <span className="patientManagementStatIcon">{icon}</span>
      <span className="patientManagementStatValue">{value}</span>
      <span className="patientManagementStatLabel">{label}</span>
    </div>
  );
}

export default function PatientList({
  patients,
  isLoading = false,
  hasSearch = false,
  page,
  pageSize,
  total,
  gender,
  surgicalProcedureId,
  surgicalProcedures = [],
  isLoadingSurgicalProcedures = false,
  onGenderChange,
  onSurgicalProcedureChange,
  onPageChange,
  onRowClick,
  onAdd,
}: PatientListProps) {
  const { t } = useTranslation();

  const pageStats = useMemo(() => {
    const management = patients.map((patient) => patient.management).filter(Boolean);
    return {
      active: management.reduce((sum, item) => sum + (item?.activeOperations ?? 0), 0),
      followUps: management.reduce((sum, item) => sum + (item?.upcomingFollowUps ?? 0), 0),
      files: management.reduce((sum, item) => sum + (item?.clinicalFiles ?? 0), 0),
    };
  }, [patients]);

  const getGenderLabel = (value: Gender) => value === Gender.Male ? t('patients.male') : t('patients.female');

  const renderCard = (patient: Patient) => {
    const management = patient.management;
    const operations = management?.totalOperations ?? patient._count?.operations ?? 0;
    const active = management?.activeOperations ?? 0;
    const followUps = management?.upcomingFollowUps ?? 0;
    const files = management?.clinicalFiles ?? 0;

    return (
      <Card key={patient.id} className="patientManagementCard" bordered={false} onClick={() => onRowClick(patient.id)} styles={{ body: { padding: 0 } }}>
        <div className="patientManagementCardBody">
          <div className="patientManagementCardTop">
            <div className="patientManagementIdentity">
              <div className={`patientManagementAvatar patientManagementAvatar--${patient.gender.toLowerCase()}`}>
                {getInitials(patient.fullName)}
              </div>
              <div className="patientManagementIdentityText">
                <div className="patientManagementName">{patient.fullName || '—'}</div>
                <div className="patientManagementAge">
                  <CalendarOutlined />
                  {patient.age} {t('common.age')}
                  <span>•</span>
                  <span>{getGenderLabel(patient.gender)}</span>
                </div>
              </div>
            </div>
            <RightOutlined className="patientManagementChevron" />
          </div>

          <div className="patientManagementContact" onClick={(event) => event.stopPropagation()}>
            <PhoneOutlined />
            <PhoneLink value={patient.mobile} showIcon={false} />
          </div>

          <div className="patientManagementStats">
            <Stat icon={<TeamOutlined />} value={operations} label={t('patients.totalOperations')} tone="blue" />
            <Stat icon={<ClockCircleOutlined />} value={active} label={t('patients.activeCases', 'Active cases')} tone="orange" />
            <Stat icon={<CalendarOutlined />} value={followUps} label={t('patients.upcomingFollowUps', 'Follow-ups')} tone="purple" />
            {/* <Stat icon={<FileImageOutlined />} value={files} label={t('patients.clinicalFiles', 'Clinical files')} tone="green" /> */}
          </div>

          {management?.lastOperation && (
            <div className="patientManagementLastCase">
              <div>
                <span className="patientManagementLastCaseLabel">{t('patients.lastOperation', 'Last operation')}</span>
                <span className="patientManagementLastCaseName">{management.lastOperation.name}</span>
              </div>
              <Tag color={management.lastOperation.status === 'COMPLETED' ? 'success' : management.lastOperation.status === 'CANCELLED' ? 'error' : 'processing'}>
                {management.lastOperation.status.replace('_', ' ')}
              </Tag>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const emptyNode = (
    <div className="patientListEmpty">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={hasSearch ? t('common.noResults') : t('patients.noPatients')}>
        {!hasSearch && <Button type="primary" onClick={onAdd}>{t('patients.addPatient')}</Button>}
      </Empty>
    </div>
  );

  return (
    <div className="patientList">
      <div className="patientManagementToolbar">
        <div className="patientManagementResultCount"><strong>{total}</strong> {t('patients.patientRecords', 'patient records')}</div>
        <div className="patientManagementFilters">
          {onSurgicalProcedureChange && (
            <Select
              allowClear
              showSearch
              value={surgicalProcedureId}
              placeholder={t('patients.filterSurgicalProcedure', 'Surgical Procedures')}
              onChange={(value: string | undefined) => onSurgicalProcedureChange(value)}
              loading={isLoadingSurgicalProcedures}
              optionFilterProp="label"
              suffixIcon={<ScissorOutlined />}
              options={surgicalProcedures.map((procedure) => ({
                value: procedure.id,
                label: procedure.name,
              }))}
              className="patientManagementProcedureFilter"
            />
          )}
          {onGenderChange && (
            <Select
              allowClear
              value={gender}
              placeholder={t('patients.filterGender', 'Filter by gender')}
              onChange={(value: Gender | undefined) => onGenderChange(value)}
              options={[
                { value: Gender.Male, label: getGenderLabel(Gender.Male) },
                { value: Gender.Female, label: getGenderLabel(Gender.Female) },
              ]}
              className="patientManagementGenderFilter"
            />
          )}
        </div>
      </div>

      <div className="patientManagementSummary">
        <Stat icon={<TeamOutlined />} value={patients.length} label={t('patients.onThisPage', 'On this page')} tone="blue" />
        <Stat icon={<ClockCircleOutlined />} value={pageStats.active} label={t('patients.activeCases', 'Active cases')} tone="orange" />
        <Stat icon={<CalendarOutlined />} value={pageStats.followUps} label={t('patients.upcomingFollowUps', 'Follow-ups')} tone="purple" />
        <Stat icon={<FileImageOutlined />} value={pageStats.files} label={t('patients.clinicalFiles', 'Clinical files')} tone="green" />
      </div>

      <Spin spinning={isLoading}>
        {patients.length === 0 && !isLoading ? emptyNode : <div className="patientManagementGrid">{patients.map(renderCard)}</div>}
      </Spin>

      {total > pageSize && (
        <div className="patientManagementPagination">
          <Pagination current={page} pageSize={pageSize} total={total} onChange={onPageChange} showSizeChanger={false} showLessItems />
        </div>
      )}
    </div>
  );
}
