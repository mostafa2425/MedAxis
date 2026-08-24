import { useMemo, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Empty, Skeleton, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileImageOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  PlusOutlined,
  RightOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { patientService } from '@/services/patient.service';
import { formatDate, getInitials, getStatusColor } from '@/utils/helpers';
import PhoneLink from '@/components/common/PhoneLink';
import { Gender, type Operation, type OperationFollowUp, type Patient } from '@/types';
import './PatientDetail.scss';
import './PatientDetailV2.scss';

type PatientOperation = Operation & {
  files?: Array<{ id: string; fileName: string; fileType: string; fileSize: number | null; mimeType: string | null }>;
  followUps?: OperationFollowUp[];
};

type PatientDetailData = Patient & { operations?: PatientOperation[] };

function DetailStat({ icon, value, label, tone }: { icon: ReactNode; value: number; label: string; tone: string }) {
  return (
    <div className={`patientDetailStat patientDetailStat--${tone}`}>
      <span className="patientDetailStatIcon">{icon}</span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function OperationRow({ operation, onOpen }: { operation: PatientOperation; onOpen: () => void }) {
  const { t } = useTranslation();
  const followUps = operation.followUps ?? [];
  const activeFollowUps = followUps.filter((item) => item.status === 'UPCOMING' || item.status === 'OVERDUE');
  const statusLabel = t(`operations.${operation.status.toLowerCase()}`, operation.status.replace('_', ' '));

  return (
    <button type="button" className="patientCaseCard" onClick={onOpen}>
      <div className="patientCaseMain">
        <div className="patientCaseIcon"><MedicineBoxOutlined /></div>
        <div className="patientCaseContent">
          <div className="patientCaseTitleRow">
            <strong>{operation.name}</strong>
            <Tag color={getStatusColor(operation.status)}>{statusLabel}</Tag>
          </div>
          <div className="patientCaseMeta">
            <span><CalendarOutlined /> {formatDate(operation.operationDate)}</span>
            {operation.operationTime && <span><ClockCircleOutlined /> {operation.operationTime}</span>}
            {operation.hospital && <span>{operation.hospital.name}</span>}
          </div>
        </div>
        <RightOutlined className="patientCaseArrow" />
      </div>
      <div className="patientCaseFooter">
        <span>{operation.files?.length ?? 0} {t('patients.clinicalFiles', 'files')}</span>
        <span>{activeFollowUps.length} {t('patients.followUps', 'follow-ups')}</span>
        {operation.cost && <span>{operation.cost.totalCost.toLocaleString()} EGP</span>}
      </div>
    </button>
  );
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id!),
    enabled: Boolean(id),
  });

  const patient = (data?.data?.data ?? null) as PatientDetailData | null;
  const operations = patient?.operations ?? [];

  const management = useMemo(() => {
    const activeOperations = operations.filter((item) => item.status === 'SCHEDULED' || item.status === 'IN_PROGRESS').length;
    const followUps = operations.flatMap((item) => item.followUps ?? []);
    const upcomingFollowUps = followUps.filter((item) => item.status === 'UPCOMING' || item.status === 'OVERDUE');
    const files = operations.flatMap((item) => item.files ?? []);
    return { activeOperations, upcomingFollowUps, files };
  }, [operations]);

  const handleBack = () => navigate('/patients');
  const handleEdit = () => navigate(`/patients/new?edit=${id}`);
  const handleAddOperation = () => navigate(`/operations/new?patientId=${id}`);
  const handleOpenOperation = (operationId: string) => navigate(`/operations/${operationId}`);

  if (isLoading) {
    return <div className="patient-detail-page page patientDetailV2"><Skeleton active paragraph={{ rows: 7 }} /></div>;
  }

  if (isError || !patient) {
    return (
      <div className="patient-detail-page page patientDetailV2">
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={handleBack}>{t('common.back')}</Button>
        <Empty description={t('common.noData')}><Button type="primary" onClick={handleBack}>{t('common.back')}</Button></Empty>
      </div>
    );
  }

  const isMale = patient.gender === Gender.Male;

  return (
    <div className="patient-detail-page page patientDetailV2">
      <div className="patientDetailTopbar">
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={handleBack}>{t('common.back')}</Button>
        <div className="patientDetailActions">
          <Button icon={<EditOutlined />} onClick={handleEdit}>{t('common.edit')}</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOperation}>{t('patients.newOperation')}</Button>
        </div>
      </div>

      <section className="patientProfileHero">
        <div className={`patientProfileAvatar patientProfileAvatar--${isMale ? 'male' : 'female'}`}>{getInitials(patient.fullName)}</div>
        <div className="patientProfileIdentity">
          <div className="patientProfileTitleRow">
            <h1>{patient.fullName}</h1>
            <Tag color={isMale ? 'blue' : 'magenta'}>{isMale ? t('patients.male') : t('patients.female')}</Tag>
          </div>
          <div className="patientProfileMeta">
            <span>{patient.age} {t('common.age')}</span><span>•</span>
            <span>{t('patients.registeredOn')}: {formatDate(patient.createdAt)}</span>
          </div>
          {patient.mobile && <div className="patientProfilePhone"><PhoneOutlined /><PhoneLink value={patient.mobile} showIcon={false} /></div>}
        </div>
      </section>

      <div className="patientDetailStats">
        <DetailStat icon={<TeamOutlined />} value={operations.length} label={t('patients.totalOperations')} tone="blue" />
        <DetailStat icon={<ClockCircleOutlined />} value={management.activeOperations} label={t('patients.activeCases', 'Active cases')} tone="orange" />
        <DetailStat icon={<CalendarOutlined />} value={management.upcomingFollowUps.length} label={t('patients.upcomingFollowUps', 'Follow-ups')} tone="purple" />
        <DetailStat icon={<FileImageOutlined />} value={management.files.length} label={t('patients.clinicalFiles', 'Clinical files')} tone="green" />
      </div>

      {patient.notes && (
        <Card className="patientNotesCard" bordered={false}>
          <div className="patientDetailSectionHeading"><FileTextOutlined /><span>{t('patients.notes')}</span></div>
          <p>{patient.notes}</p>
        </Card>
      )}

      <section className="patientDetailSection">
        <div className="patientDetailSectionHeading patientDetailSectionHeading--large">
          <div><MedicineBoxOutlined /><span>{t('patients.patientHistory')}</span></div>
          <span className="patientDetailSectionCount">{operations.length}</span>
        </div>
        {operations.length === 0 ? (
          <Card className="patientEmptyCard" bordered={false}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('patients.noOperations')}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOperation}>{t('patients.newOperation')}</Button>
            </Empty>
          </Card>
        ) : (
          <div className="patientCasesList">{operations.map((operation) => <OperationRow key={operation.id} operation={operation} onOpen={() => handleOpenOperation(operation.id)} />)}</div>
        )}
      </section>

      <section className="patientDetailSection">
        <div className="patientDetailSectionHeading patientDetailSectionHeading--large">
          <div><CalendarOutlined /><span>{t('patients.upcomingFollowUps', 'Follow-ups')}</span></div>
          <span className="patientDetailSectionCount">{management.upcomingFollowUps.length}</span>
        </div>
        {management.upcomingFollowUps.length === 0 ? (
          <Card className="patientEmptyCard" bordered={false}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('patients.noFollowUps', 'No upcoming follow-ups')} /></Card>
        ) : (
          <div className="patientFollowUpList">
            {management.upcomingFollowUps.slice(0, 6).map((followUp) => {
              const operation = operations.find((item) => item.id === followUp.operationId);
              return (
                <button key={followUp.id} type="button" className={`patientFollowUp patientFollowUp--${followUp.status.toLowerCase()}`} onClick={() => handleOpenOperation(followUp.operationId)}>
                  <span className="patientFollowUpIcon"><CalendarOutlined /></span>
                  <span className="patientFollowUpContent"><strong>{followUp.title}</strong><span>{formatDate(followUp.scheduledAt)} • {operation?.name ?? t('operations.operation')}</span></span>
                  <Tag>{followUp.status}</Tag>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="patientDetailSection">
        <div className="patientDetailSectionHeading patientDetailSectionHeading--large">
          <div><FileImageOutlined /><span>{t('patients.clinicalFiles', 'Clinical files')}</span></div>
          <span className="patientDetailSectionCount">{management.files.length}</span>
        </div>
        {management.files.length === 0 ? (
          <Card className="patientEmptyCard" bordered={false}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('patients.noFiles', 'No clinical files yet')} /></Card>
        ) : (
          <div className="patientFilesGrid">
            {management.files.slice(0, 8).map((file) => (
              <button key={file.id} type="button" className="patientFileCard" onClick={() => {
                const operation = operations.find((item) => item.files?.some((itemFile) => itemFile.id === file.id));
                if (operation) handleOpenOperation(operation.id);
              }}>
                <span className="patientFileIcon"><FileImageOutlined /></span>
                <span className="patientFileName">{file.fileName}</span>
                <span className="patientFileType">{file.fileType.replaceAll('_', ' ')}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
