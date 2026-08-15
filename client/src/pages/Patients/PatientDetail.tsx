import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Avatar,
  Tag,
  Empty,
  Skeleton,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  BankOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { patientService } from '@/services/patient.service';
import { operationService } from '@/services/operation.service';
import { formatDate, getInitials, formatCurrency, getStatusColor } from '@/utils/helpers';
import { Gender, OperationStatus, type Patient, type Operation } from '@/types';
import './PatientDetail.scss';

// ─── Status Tag Label ─────────────────────────────
function getStatusLabel(status: OperationStatus, t: (key: string) => string): string {
  const labels: Record<OperationStatus, string> = {
    [OperationStatus.Scheduled]: t('operations.scheduled'),
    [OperationStatus.CheckedIn]: t('operations.checkedIn'),
    [OperationStatus.InProgress]: t('operations.inProgress'),
    [OperationStatus.Completed]: t('operations.completed'),
    [OperationStatus.Cancelled]: t('operations.cancelled'),
    [OperationStatus.NoShow]: t('operations.noShow'),
  };
  return labels[status] ?? status;
}

// ─── Info Row ─────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="infoRow">
      <div className="infoRowIcon">{icon}</div>
      <div className="infoRowContent">
        <span className="infoRowLabel">{label}</span>
        <span className="infoRowValue">{value || '—'}</span>
      </div>
    </div>
  );
}

// ─── Operation Card ───────────────────────────────
function OperationCard({ operation }: { operation: Operation }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const statusColor = getStatusColor(operation.status);
  const statusLabel = getStatusLabel(operation.status, t);

  const handleOperationClick = () => {
    navigate(`/operations/${operation.id}`);
  };

  return (
    <div className="operationCard" onClick={handleOperationClick} role="button" tabIndex={0}>
      <div className="operationCardHeader">
        <span className="operationName">{operation.name}</span>
        <Tag
          color={statusColor}
          className="statusTag"
        >
          {statusLabel}
        </Tag>
      </div>
      <div className="operationCardBody">
        {operation.hospital && (
          <span className="operationMetaItem">
            <BankOutlined className="operationMetaIcon" />
            {operation.hospital.name}
          </span>
        )}
        <span className="operationMetaItem">
          <CalendarOutlined className="operationMetaIcon" />
          {formatDate(operation.operationDate)}
        </span>
        {operation.cost && (
          <span className="operationMetaItem">
            <DollarOutlined className="operationMetaIcon" />
            {formatCurrency(operation.cost.totalCost)}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────
function DetailSkeleton() {
  return (
    <div className="patient-detail-page page">
      <div className="pageHeader">
        <Skeleton.Input active size="small" style={{ width: 120, height: 20 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Skeleton.Button active size="small" />
          <Skeleton.Button active size="small" />
        </div>
      </div>
      <div className="patientInfoCard">
        <div className="infoCardHeader">
          <Skeleton.Avatar active size={72} shape="circle" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <Skeleton.Input active size="small" style={{ width: 200, height: 22 }} />
            <Skeleton.Input active size="small" style={{ width: 120, height: 16 }} />
          </div>
        </div>
        <Divider style={{ margin: '16px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Skeleton.Avatar active size={32} shape="circle" />
              <Skeleton.Input active size="small" style={{ width: 180, height: 16 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="operationsSection">
        <Skeleton.Input active size="small" style={{ width: 160, height: 22, marginBottom: 16 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="operationCard">
              <Skeleton.Input active size="small" style={{ width: 200, height: 18 }} />
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <Skeleton.Input active size="small" style={{ width: 100, height: 14 }} />
                <Skeleton.Input active size="small" style={{ width: 100, height: 14 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Patient Detail Page
// ═══════════════════════════════════════════════════════
export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ─── Fetch Patient ───────────────────────────────
  const {
    data: patientResponse,
    isLoading: isLoadingPatient,
    isError: isPatientError,
  } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id!),
    enabled: Boolean(id),
  });

  const patient: Patient | null = patientResponse?.data?.data ?? null;

  // ─── Fetch Operations for this Patient ──────────
  const { data: operationsResponse } = useQuery({
    queryKey: ['patient-operations', id],
    queryFn: () =>
      operationService.getAll({
        patientId: id,
        limit: 50,
      } as Parameters<typeof operationService.getAll>[0]),
    enabled: Boolean(id),
  });

  const operations: Operation[] = operationsResponse?.data?.data ?? [];

  // ─── Derived Values ──────────────────────────────
  const age = patient?.age ?? null;
  const isMale = patient?.gender === Gender.Male;

  // ─── Handlers ────────────────────────────────────
  const handleBack = () => {
    navigate('/patients');
  };

  const handleEdit = () => {
    navigate(`/patients/new?edit=${id}`);
  };

  // ─── Loading ─────────────────────────────────────
  if (isLoadingPatient) {
    return <DetailSkeleton />;
  }

  // ─── Error ───────────────────────────────────────
  if (isPatientError || !patient) {
    return (
      <div className="patient-detail-page page">
        <div className="pageHeader">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            type="text"
            className="backButton"
          >
            {t('common.back')}
          </Button>
        </div>
        <Empty
          className="emptyState"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.noData')}
        >
          <Button type="primary" onClick={handleBack}>
            {t('common.back')}
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="patient-detail-page page">
      {/* ─── Page Header ────────────────────────────── */}
      <div className="pageHeader">
        <div className="headerLeft">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            type="text"
            className="backButton"
          >
            {t('common.back')}
          </Button>
          <h1 className="pageTitle">{patient.fullName}</h1>
        </div>
        <Button
          icon={<EditOutlined />}
          onClick={handleEdit}
          size="large"
        >
          {t('common.edit')}
        </Button>
      </div>

      {/* ─── Patient Info Card ──────────────────────── */}
      <div className="patientInfoCard">
        <div className="infoCardHeader">
          <Avatar
            size={72}
            className={`patientAvatar ${isMale ? 'patientAvatarMale' : 'patientAvatarFemale'}`}
          >
            {getInitials(patient.fullName)}
          </Avatar>
          <div className="infoCardTitleSection">
            <h2 className="infoCardName">{patient.fullName}</h2>
            <div className="infoCardBadges">
              <Tag
                className="genderBadge"
                style={{
                  color: isMale ? '#2563EB' : '#EC4899',
                  background: isMale ? 'rgba(37,99,235,0.1)' : 'rgba(236,72,153,0.1)',
                  borderColor: isMale ? 'rgba(37,99,235,0.2)' : 'rgba(236,72,153,0.2)',
                }}
              >
                {isMale ? t('patients.male') : t('patients.female')}
              </Tag>
              {age !== null && (
                <Tag className="ageBadge">
                  {age} {t('common.age')}
                </Tag>
              )}
            </div>
          </div>
        </div>

        <Divider className="infoCardDivider" />

        <div className="infoGrid">
          {patient.mobile && (
            <InfoRow
              icon={<PhoneOutlined />}
              label={t('patients.mobile')}
              value={patient.mobile}
            />
          )}
          <InfoRow
            icon={<CalendarOutlined />}
            label={t('patients.registeredOn')}
            value={formatDate(patient.createdAt)}
          />
          <InfoRow
            icon={<TeamOutlined />}
            label={t('patients.totalOperations')}
            value={t('patients.operationsCount', {
              count: patient._count?.operations ?? 0,
            })}
          />
          {patient.notes && (
            <InfoRow
              icon={<FileTextOutlined />}
              label={t('patients.notes')}
              value={
                <span className="notesText">{patient.notes}</span>
              }
            />
          )}
        </div>
      </div>

      {/* ─── Operations History ─────────────────────── */}
      <div className="operationsSection">
        <h2 className="sectionTitle">{t('patients.patientHistory')}</h2>

        {operations.length === 0 ? (
          <div className="operationsEmpty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('patients.noOperations')}
            />
          </div>
        ) : (
          <div className="operationsGrid">
            {operations.map((op) => (
              <OperationCard key={op.id} operation={op} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
