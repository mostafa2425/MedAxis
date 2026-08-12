import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Tag,
  Descriptions,
  Card,
  Tabs,
  Timeline,
  Empty,
  Spin,
  Modal,
  Popconfirm,
  message,
  Select,
  Input,
  Avatar,
  Divider,
  Row,
  Col,
  Tooltip,
  Image,
  Space,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  DollarOutlined,
  CloudUploadOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  SwapOutlined,
  EyeOutlined,
  BankOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CameraOutlined,
  SaveOutlined,
  PhoneOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  PlusOutlined,
  InboxOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { operationService } from '@/services/operation.service';
import { useDebounce } from '@/hooks/useDebounce';
import {
  formatCurrency,
  formatDate,
  formatTime,
  getStatusColor,
  getInitials,
  calculateRemaining,
} from '@/utils/helpers';
import { OPERATION_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '@/utils/constants';
import {
  OperationStatus,
  FileType,
  TimelineAction,
  type Operation,
  type OperationTimeline,
  type OperationFile,
} from '@/types';

import styles from './OperationDetailPage.module.scss';

// ═══════════════════════════════════════════════════════
// Constants & Helpers
// ═══════════════════════════════════════════════════════

const ACCEPTED_FILE_TYPES =
  '.jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.dicom,.avi,.mp4,.mov';

function getStatusLabel(status: OperationStatus): string {
  return OPERATION_STATUSES.find((s) => s.value === status)?.label ?? status;
}

function getStatusBg(status: OperationStatus): string {
  return OPERATION_STATUSES.find((s) => s.value === status)?.bg ?? 'rgba(148,163,184,0.1)';
}

function getPaymentLabel(method: string): string {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method;
}

function getPayStatusLabel(status: string): string {
  return PAYMENT_STATUSES.find((s) => s.value === status)?.label ?? status;
}

function getTimelineIcon(action: TimelineAction): React.ReactNode {
  switch (action) {
    case TimelineAction.Created:
      return <PlusOutlined style={{ color: '#2563EB' }} />;
    case TimelineAction.StatusChanged:
      return <SyncOutlined style={{ color: '#7C3AED' }} />;
    case TimelineAction.CostUpdated:
      return <DollarOutlined style={{ color: '#16A34A' }} />;
    case TimelineAction.FileUploaded:
      return <UploadOutlined style={{ color: '#0284C7' }} />;
    case TimelineAction.FileRemoved:
      return <DeleteOutlined style={{ color: '#DC2626' }} />;
    case TimelineAction.TeamUpdated:
      return <TeamOutlined style={{ color: '#14B8A6' }} />;
    case TimelineAction.PaymentRecorded:
      return <DollarOutlined style={{ color: '#F59E0B' }} />;
    case TimelineAction.NotesUpdated:
      return <FileTextOutlined style={{ color: '#64748B' }} />;
    default:
      return <InfoCircleOutlined style={{ color: '#94A3B8' }} />;
  }
}

function getTimelineColor(action: TimelineAction): string {
  switch (action) {
    case TimelineAction.Created:
      return '#2563EB';
    case TimelineAction.StatusChanged:
      return '#7C3AED';
    case TimelineAction.CostUpdated:
      return '#16A34A';
    case TimelineAction.FileUploaded:
      return '#0284C7';
    case TimelineAction.FileRemoved:
      return '#DC2626';
    case TimelineAction.TeamUpdated:
      return '#14B8A6';
    case TimelineAction.PaymentRecorded:
      return '#F59E0B';
    case TimelineAction.NotesUpdated:
      return '#64748B';
    default:
      return '#94A3B8';
  }
}

function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ═══════════════════════════════════════════════════════
// File Gallery Component
// ═══════════════════════════════════════════════════════

function FileGallery({
  files,
  onDeleteFile,
}: {
  files: OperationFile[];
  onDeleteFile: (fileId: string) => void;
}) {
  const { t } = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = useCallback((file: OperationFile) => {
    setPreviewUrl(file.fileUrl);
    setPreviewTitle(file.fileName);
    setPreviewVisible(true);
  }, []);

  const handleDownload = useCallback((file: OperationFile) => {
    const a = document.createElement('a');
    a.href = file.fileUrl;
    a.download = file.fileName;
    a.click();
  }, []);

  if (files.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('operations.noFiles')}
        className={styles.emptyFiles}
      />
    );
  }

  return (
    <>
      <div className={styles.fileGallery}>
        {files.map((file) => (
          <div key={file.id} className={styles.fileThumb}>
            <div
              className={styles.fileThumbPreview}
              onClick={() => handlePreview(file)}
              role="button"
              tabIndex={0}
            >
              {file.mimeType?.startsWith('image/') ? (
                <img src={file.fileUrl} alt={file.fileName} className={styles.fileThumbImg} />
              ) : (
                <div className={styles.fileThumbPlaceholder}>
                  <FileImageOutlined style={{ fontSize: 24, color: '#94A3B8' }} />
                  <span className={styles.fileThumbExt}>
                    {file.fileName.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.fileThumbName} title={file.fileName}>
              {file.fileName}
            </div>
            <div className={styles.fileThumbSize}>
              {file.fileSize ? `${(file.fileSize / 1024).toFixed(1)} KB` : ''}
            </div>
            <div className={styles.fileThumbActions}>
              <Tooltip title={t('operations.preview')}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview(file)}
                />
              </Tooltip>
              <Tooltip title={t('operations.downloadFile')}>
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(file)}
                />
              </Tooltip>
              <Popconfirm
                title={t('operations.deleteFile')}
                onConfirm={() => onDeleteFile(file.id)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Tooltip title={t('common.delete')}>
                  <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>

      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewVisible,
          src: previewUrl,
          onVisibleChange: (vis) => setPreviewVisible(vis),
          title: previewTitle,
        }}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// Main Detail Page
// ═══════════════════════════════════════════════════════

export default function OperationDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // ── State ──────────────────────────────────────
  const [activeTab, setActiveTab] = useState('info');
  const [notesValue, setNotesValue] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const notesAutoSaveRef = useRef(false);
  const debouncedNotes = useDebounce(notesValue, 1000);

  // ── Fetch Operation ─────────────────────────────
  const {
    data: operationData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['operation-detail', id],
    queryFn: () => operationService.getById(id!),
    enabled: !!id,
  });

  const operation: Operation | null = operationData?.data?.data ?? null;

  // ── Fetch Timeline ─────────────────────────────
  const { data: timelineData } = useQuery({
    queryKey: ['operation-timeline', id],
    queryFn: () => operationService.getTimeline(id!),
    enabled: !!id,
  });

  const timeline: OperationTimeline[] = timelineData?.data?.data ?? [];

  // ── Initialize notes ───────────────────────────
  useEffect(() => {
    if (operation?.notes) {
      setNotesValue(operation.notes);
    }
  }, [operation?.notes]);

  // ── Auto-save notes ─────────────────────────────
  const updateNotesMutation = useMutation({
    mutationFn: ({ opId, notes }: { opId: string; notes: string }) =>
      operationService.update(opId, { notes }),
  });

  useEffect(() => {
    if (id && operation && debouncedNotes !== undefined && !notesAutoSaveRef.current) {
      if (debouncedNotes !== (operation.notes ?? '')) {
        notesAutoSaveRef.current = true;
        updateNotesMutation.mutate(
          { opId: id, notes: debouncedNotes },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['operation-detail', id] });
            },
            onSettled: () => {
              notesAutoSaveRef.current = false;
            },
          },
        );
      }
    }
  }, [debouncedNotes, id, operation]);

  // ── Status Change Mutation ─────────────────────
  const changeStatusMutation = useMutation({
    mutationFn: ({ opId, status }: { opId: string; status: string }) =>
      operationService.changeStatus(opId, status),
  });

  // ── Delete Mutation ────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (opId: string) => operationService.delete(opId),
  });

  // ── Upload Mutation ────────────────────────────
  const uploadMutation = useMutation({
    mutationFn: ({ opId, formData: fd }: { opId: string; formData: FormData }) =>
      operationService.uploadFiles(opId, fd),
  });

  // ── Delete File Mutation ───────────────────────
  const deleteFileMutation = useMutation({
    mutationFn: ({ opId, fileId }: { opId: string; fileId: string }) =>
      operationService.deleteFile(opId, fileId),
  });

  // ── File categorization ───────────────────────
  const beforeFiles = useMemo(
    () => operation?.files?.filter((f) => f.fileType === FileType.BeforeOperation) ?? [],
    [operation?.files],
  );

  const afterFiles = useMemo(
    () => operation?.files?.filter((f) => f.fileType === FileType.AfterOperation) ?? [],
    [operation?.files],
  );

  // ── Handlers ───────────────────────────────────
  const handleStatusChange = useCallback(
    (newStatus: string) => {
      if (!id) return;
      changeStatusMutation.mutate(
        { opId: id, status: newStatus },
        {
          onSuccess: () => {
            messageApi.success(t('operations.statusUpdated'));
            queryClient.invalidateQueries({ queryKey: ['operation-detail', id] });
            queryClient.invalidateQueries({ queryKey: ['operations'] });
          },
          onError: () => {
            messageApi.error(t('common.operationFailed'));
          },
        },
      );
      setStatusDropdownOpen(false);
    },
    [id, changeStatusMutation, queryClient, messageApi, t],
  );

  const handleDeleteOperation = useCallback(() => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        messageApi.success(t('operations.operationDeleted'));
        queryClient.invalidateQueries({ queryKey: ['operations'] });
        navigate('/operations');
      },
      onError: () => {
        messageApi.error(t('common.operationFailed'));
      },
    });
  }, [id, deleteMutation, queryClient, messageApi, t, navigate]);

  const handleDeleteFile = useCallback(
    (fileId: string) => {
      if (!id) return;
      deleteFileMutation.mutate(
        { opId: id, fileId },
        {
          onSuccess: () => {
            messageApi.success(t('operations.fileDeleted'));
            queryClient.invalidateQueries({ queryKey: ['operation-detail', id] });
          },
          onError: () => {
            messageApi.error(t('common.operationFailed'));
          },
        },
      );
    },
    [id, deleteFileMutation, queryClient, messageApi, t],
  );

  const handleFileUpload = useCallback(
    (fileType: FileType) => async (file: File) => {
      if (!id) return false;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('fileType', fileType);
      try {
        await uploadMutation.mutateAsync({ opId: id, formData: fd });
        messageApi.success(t('operations.fileUploaded'));
        queryClient.invalidateQueries({ queryKey: ['operation-detail', id] });
      } catch {
        messageApi.error(t('common.operationFailed'));
      }
      return false;
    },
    [id, uploadMutation, queryClient, messageApi, t],
  );

  // ─── Loading State ───────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.page}>
        {contextHolder}
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────
  if (isError || !operation) {
    return (
      <div className={styles.page}>
        {contextHolder}
        <div className={styles.pageHeader}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations')}>
            {t('common.back')}
          </Button>
        </div>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.notFound')}
          className={styles.emptyState}
        >
          <Button type="primary" onClick={() => navigate('/operations')}>
            {t('operations.title')}
          </Button>
        </Empty>
      </div>
    );
  }

  // ─── Derived data ───────────────────────────────
  const remaining = operation.cost
    ? calculateRemaining(operation.cost.totalCost, operation.cost.paidAmount)
    : 0;

  const costPercentage = operation.cost?.totalCost
    ? Math.min(100, Math.round((operation.cost.paidAmount / operation.cost.totalCost) * 100))
    : 0;

  // ═══════════════════════════════════════════════════════
  // Tab Items
  // ═══════════════════════════════════════════════════════

  const tabItems = [
    {
      key: 'info',
      label: (
        <span className={styles.tabLabel}>
          <InfoCircleOutlined /> {t('operations.operationDetails')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <Descriptions
            bordered
            column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
            size="small"
            className={styles.descriptions}
          >
            <Descriptions.Item label={t('operations.operationName')}>
              <span className={styles.descValue}>{operation.name}</span>
            </Descriptions.Item>
            <Descriptions.Item label={t('operations.diagnosis')}>
              <span className={styles.descValue}>{operation.diagnosis || '—'}</span>
            </Descriptions.Item>
            <Descriptions.Item label={t('operations.specialty')}>
              <Tag color="blue">{operation.specialty?.name || '—'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('operations.hospital')}>
              <span className={styles.descValue}>
                <BankOutlined className={styles.descIcon} />
                {operation.hospital?.name || '—'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={t('operations.operationDate')}>
              <span className={styles.descValue}>
                <CalendarOutlined className={styles.descIcon} />
                {formatDate(operation.operationDate)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={t('operations.operationTime')}>
              <span className={styles.descValue}>
                <ClockCircleOutlined className={styles.descIcon} />
                {formatTime(operation.operationTime)}
              </span>
            </Descriptions.Item>
            {operation.operationRoom && (
              <Descriptions.Item label={t('operations.operationRoom')}>
                {operation.operationRoom}
              </Descriptions.Item>
            )}
            {operation.duration && (
              <Descriptions.Item label={t('operations.duration')}>
                {formatDuration(operation.duration)}
              </Descriptions.Item>
            )}
            <Descriptions.Item label={t('operations.status')}>
              <Tag
                color={getStatusBg(operation.status)}
                style={{ color: getStatusColor(operation.status), border: 'none' }}
              >
                {getStatusLabel(operation.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('common.created')} span={2}>
              {formatDate(operation.createdAt, 'DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },

    {
      key: 'patient',
      label: (
        <span className={styles.tabLabel}>
          <UserOutlined /> {t('operations.patient')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          {operation.patient ? (
            <Card className={styles.patientCard}>
              <div className={styles.patientCardHeader}>
                <Avatar
                  size={56}
                  style={{
                    backgroundColor:
                      operation.patient.gender === 'MALE'
                        ? 'rgba(37,99,235,0.1)'
                        : 'rgba(236,72,153,0.1)',
                    color:
                      operation.patient.gender === 'MALE' ? '#2563EB' : '#EC4899',
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {getInitials(operation.patient.fullName)}
                </Avatar>
                <div className={styles.patientCardInfo}>
                  <h3 className={styles.patientCardName}>{operation.patient.fullName}</h3>
                  <div className={styles.patientCardMeta}>
                    <Tag
                      style={{
                        borderRadius: 20,
                        border: 'none',
                        fontSize: 11,
                        color:
                          operation.patient.gender === 'MALE' ? '#2563EB' : '#EC4899',
                        background:
                          operation.patient.gender === 'MALE'
                            ? 'rgba(37,99,235,0.1)'
                            : 'rgba(236,72,153,0.1)',
                      }}
                    >
                      {operation.patient.gender === 'MALE' ? 'Male' : 'Female'}
                    </Tag>
                    {operation.patient._count && (
                      <span className={styles.opsCount}>
                        {operation.patient._count.operations} operation(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Divider className={styles.patientDivider} />
              <Row gutter={[16, 12]}>
                {operation.patient.mobile && (
                  <Col xs={12} sm={8}>
                    <span className={styles.patientMeta}>
                      <PhoneOutlined className={styles.patientMetaIcon} />
                      {operation.patient.mobile}
                    </span>
                  </Col>
                )}
                {operation.patient.email && (
                  <Col xs={12} sm={8}>
                    <span className={styles.patientMeta}>
                      <UserOutlined className={styles.patientMetaIcon} />
                      {operation.patient.email}
                    </span>
                  </Col>
                )}
                {operation.patient.nationalId && (
                  <Col xs={12} sm={8}>
                    <span className={styles.patientMeta}>
                      <HomeOutlined className={styles.patientMetaIcon} />
                      {operation.patient.nationalId}
                    </span>
                  </Col>
                )}
              </Row>
              <div className={styles.patientAction}>
                <Button
                  type="primary"
                  ghost
                  icon={<UserOutlined />}
                  onClick={() => navigate(`/patients/${operation.patientId}`)}
                >
                  {t('patients.viewProfile')}
                </Button>
              </div>
            </Card>
          ) : (
            <Empty description="Patient info unavailable" />
          )}
        </div>
      ),
    },

    {
      key: 'team',
      label: (
        <span className={styles.tabLabel}>
          <TeamOutlined /> {t('operations.medicalTeam')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          {operation.medicalTeam ? (
            <div className={styles.teamGrid}>
              <TeamMemberCard
                title={t('operations.primarySurgeon')}
                doctor={operation.medicalTeam.primarySurgeon}
                isPrimary
              />
              <TeamMemberCard
                title={t('operations.assistantSurgeon')}
                doctor={operation.medicalTeam.assistantSurgeon}
              />
              <TeamMemberCard
                title={t('operations.anesthesiologist')}
                doctor={operation.medicalTeam.anesthesiologist}
              />
              <TeamMemberCard
                title={t('operations.assistantAnesthesia')}
                doctor={operation.medicalTeam.assistantAnesthesia}
              />
              <TeamMemberCard
                title={t('operations.nurse')}
                doctor={operation.medicalTeam.nurse}
              />
            </div>
          ) : (
            <Empty description={t('operations.noTeamAssigned')} />
          )}
        </div>
      ),
    },

    {
      key: 'cost',
      label: (
        <span className={styles.tabLabel}>
          <DollarOutlined /> {t('operations.cost')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          {operation.cost ? (
            <>
              <Row gutter={[16, 16]} className={styles.costSummary}>
                <Col xs={24} md={8}>
                  <div className={styles.costCard}>
                    <span className={styles.costLabel}>{t('operations.totalCost')}</span>
                    <span className={styles.costValue}>
                      {formatCurrency(operation.cost.totalCost)}
                    </span>
                    <span className={styles.costSublabel}>{t('common.currency')}</span>
                  </div>
                </Col>
                <Col xs={12} md={8}>
                  <div className={styles.costCard}>
                    <span className={styles.costLabel}>{t('operations.paidAmount')}</span>
                    <span className={`${styles.costValue} ${styles.costPaid}`}>
                      {formatCurrency(operation.cost.paidAmount)}
                    </span>
                    <div className={styles.costProgress}>
                      <div
                        className={styles.costProgressBar}
                        style={{ width: `${costPercentage}%` }}
                      />
                    </div>
                    <span className={styles.costPercentage}>{costPercentage}%</span>
                  </div>
                </Col>
                <Col xs={12} md={8}>
                  <div className={styles.costCard}>
                    <span className={styles.costLabel}>{t('operations.remainingAmount')}</span>
                    <span
                      className={`${styles.costValue} ${
                        remaining > 0 ? styles.costRemaining : styles.costZero
                      }`}
                    >
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                </Col>
              </Row>
              <Card className={styles.costDetailsCard}>
                <Row gutter={[16, 12]}>
                  <Col xs={12} sm={6}>
                    <span className={styles.detailLabel}>{t('operations.paymentMethod')}</span>
                    <br />
                    <span className={styles.detailValue}>{getPaymentLabel(operation.cost.paymentMethod)}</span>
                  </Col>
                  <Col xs={12} sm={6}>
                    <span className={styles.detailLabel}>{t('operations.paymentStatus')}</span>
                    <br />
                    <Tag
                      color={
                        operation.cost.paymentStatus === 'PAID'
                          ? 'green'
                          : operation.cost.paymentStatus === 'UNPAID'
                            ? 'red'
                            : 'orange'
                      }
                      style={{ border: 'none' }}
                    >
                      {getPayStatusLabel(operation.cost.paymentStatus)}
                    </Tag>
                  </Col>
                  {operation.cost.paymentNotes && (
                    <Col xs={24} sm={12}>
                      <span className={styles.detailLabel}>{t('operations.paymentNotes')}</span>
                      <br />
                      <span className={styles.detailValue}>{operation.cost.paymentNotes}</span>
                    </Col>
                  )}
                </Row>
              </Card>
            </>
          ) : (
            <Empty description={t('operations.noCost')} />
          )}
        </div>
      ),
    },

    {
      key: 'files',
      label: (
        <span className={styles.tabLabel}>
          <CloudUploadOutlined /> {t('operations.files')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <div className={styles.filesSection}>
            <div className={styles.fileSectionHeader}>
              <CameraOutlined className={styles.fileSectionIcon} />
              <h4 className={styles.fileSectionTitle}>{t('operations.beforeOperation')}</h4>
              <span className={styles.fileCount}>{beforeFiles.length}</span>
            </div>
            <FileGallery files={beforeFiles} onDeleteFile={handleDeleteFile} />
            <Upload.Dragger
              accept={ACCEPTED_FILE_TYPES}
              showUploadList={false}
              multiple
              beforeUpload={handleFileUpload(FileType.BeforeOperation)}
              className={styles.uploadArea}
            >
              <p className={styles.uploadIcon}>
                <InboxOutlined />
              </p>
              <p className={styles.uploadText}>{t('operations.uploadFiles')}</p>
              <p className={styles.uploadHint}>JPG, PNG, PDF, DICOM</p>
            </Upload.Dragger>
          </div>

          <Divider />

          <div className={styles.filesSection}>
            <div className={styles.fileSectionHeader}>
              <FileImageOutlined className={styles.fileSectionIcon} />
              <h4 className={styles.fileSectionTitle}>{t('operations.afterOperation')}</h4>
              <span className={styles.fileCount}>{afterFiles.length}</span>
            </div>
            <FileGallery files={afterFiles} onDeleteFile={handleDeleteFile} />
            <Upload.Dragger
              accept={ACCEPTED_FILE_TYPES}
              showUploadList={false}
              multiple
              beforeUpload={handleFileUpload(FileType.AfterOperation)}
              className={styles.uploadArea}
            >
              <p className={styles.uploadIcon}>
                <InboxOutlined />
              </p>
              <p className={styles.uploadText}>{t('operations.uploadFiles')}</p>
              <p className={styles.uploadHint}>JPG, PNG, PDF, DICOM</p>
            </Upload.Dragger>
          </div>
        </div>
      ),
    },

    {
      key: 'timeline',
      label: (
        <span className={styles.tabLabel}>
          <ClockCircleOutlined /> {t('operations.timeline')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          {timeline.length > 0 ? (
            <Timeline
              items={timeline
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item) => ({
                  color: getTimelineColor(item.action),
                  dot: getTimelineIcon(item.action),
                  children: (
                    <div key={item.id} className={styles.timelineItem}>
                      <div className={styles.timelineHeader}>
                        <span className={styles.timelineAction}>
                          {getActionLabel(item.action, t)}
                        </span>
                        <span className={styles.timelineDate}>
                          {formatDate(item.createdAt, 'DD/MM/YYYY HH:mm')}
                        </span>
                      </div>
                      {item.description && (
                        <div className={styles.timelineDescription}>{item.description}</div>
                      )}
                      {item.performedByUser && (
                        <div className={styles.timelineUser}>
                          <span className={styles.timelineUserIcon}>👤</span>
                          {item.performedByUser.name}
                        </div>
                      )}
                      {item.oldStatus && item.newStatus && (
                        <div className={styles.timelineStatusChange}>
                          <Tag
                            color={getStatusBg(item.oldStatus)}
                            style={{ color: getStatusColor(item.oldStatus), border: 'none' }}
                          >
                            {getStatusLabel(item.oldStatus)}
                          </Tag>
                          <SwapOutlined className={styles.timelineArrow} />
                          <Tag
                            color={getStatusBg(item.newStatus)}
                            style={{ color: getStatusColor(item.newStatus), border: 'none' }}
                          >
                            {getStatusLabel(item.newStatus)}
                          </Tag>
                        </div>
                      )}
                    </div>
                  ),
                }))}
            />
          ) : (
            <Empty description={t('operations.noTimeline')} />
          )}
        </div>
      ),
    },

    {
      key: 'notes',
      label: (
        <span className={styles.tabLabel}>
          <FileTextOutlined /> {t('operations.operationNotes')}
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <div className={styles.notesSection}>
            <Input.TextArea
              rows={12}
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder={t('operations.operationNotes')}
              className={styles.notesTextarea}
            />
            <div className={styles.notesFooter}>
              <Space>
                <SaveOutlined className={styles.notesSaveIcon} />
                <span className={styles.notesSaveHint}>
                  {updateNotesMutation.isPending
                    ? t('common.loading')
                    : t('common.save')}
                </span>
              </Space>
              <span className={styles.notesCharCount}>
                {notesValue.length} characters
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // ═══════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════
  return (
    <div className={styles.page}>
      {contextHolder}

      {/* ─── Page Header ──────────────────────────── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/operations')}
            className={styles.backBtn}
          >
            {t('common.back')}
          </Button>
          <div className={styles.headerInfo}>
            <h1 className={styles.pageTitle}>{operation.name}</h1>
            <div className={styles.headerMeta}>
              <Tag
                className={styles.statusTag}
                color={getStatusBg(operation.status)}
                style={{ color: getStatusColor(operation.status) }}
              >
                {getStatusLabel(operation.status)}
              </Tag>
              <span className={styles.headerDate}>
                <CalendarOutlined />
                {formatDate(operation.operationDate)} at {formatTime(operation.operationTime)}
              </span>
              {operation.patient && (
                <span className={styles.headerPatient}>
                  <UserOutlined />
                  {operation.patient.fullName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Select
            value={operation.status}
            onChange={handleStatusChange}
            open={statusDropdownOpen}
            onDropdownVisibleChange={(visible) => setStatusDropdownOpen(visible)}
            className={styles.statusDropdown}
            popupMatchSelectWidth={false}
            options={OPERATION_STATUSES.map((s) => ({
              value: s.value,
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: s.color,
                      display: 'inline-block',
                    }}
                  />
                  {s.label}
                </span>
              ),
            }))}
          />

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/operations/${id}/edit`)}
          >
            {t('common.edit')}
          </Button>

          <Popconfirm
            title={t('operations.deleteConfirm')}
            onConfirm={handleDeleteOperation}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </div>
      </div>

      {/* ─── Tabs ─────────────────────────────────── */}
      <div className={styles.tabsContainer}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
          tabBarExtraContent={
            operation.cost && (
              <div className={styles.tabsCostBadge}>
                <DollarOutlined />
                {formatCurrency(operation.cost.totalCost)}
                {operation.cost.paymentStatus !== 'PAID' && (
                  <Tag color="orange" className={styles.tabsPayTag}>
                    {getPayStatusLabel(operation.cost.paymentStatus)}
                  </Tag>
                )}
              </div>
            )
          }
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════

function TeamMemberCard({
  title,
  doctor,
  isPrimary = false,
}: {
  title: string;
  doctor?: Doctor | null;
  isPrimary?: boolean;
}) {
  if (!doctor) {
    return (
      <div className={styles.teamCard}>
        <span className={styles.teamTitle}>{title}</span>
        <span className={styles.teamEmpty}>—</span>
      </div>
    );
  }

  return (
    <div className={`${styles.teamCard} ${isPrimary ? styles.teamCardPrimary : ''}`}>
      <Avatar
        size={40}
        style={{
          backgroundColor: isPrimary ? 'rgba(37,99,235,0.1)' : 'rgba(148,163,184,0.1)',
          color: isPrimary ? '#2563EB' : '#94A3B8',
          fontWeight: 700,
        }}
      >
        {getInitials(doctor.name)}
      </Avatar>
      <div className={styles.teamInfo}>
        <span className={styles.teamTitle}>{title}</span>
        <span className={styles.teamName}>{doctor.name}</span>
        {doctor.specialty && (
          <span className={styles.teamSpecialty}>{doctor.specialty.name}</span>
        )}
      </div>
    </div>
  );
}

function getActionLabel(action: TimelineAction, t: (key: string) => string): string {
  const labels: Record<string, string> = {
    [TimelineAction.Created]: t('common.created'),
    [TimelineAction.StatusChanged]: 'Status changed',
    [TimelineAction.CostUpdated]: 'Cost updated',
    [TimelineAction.FileUploaded]: 'File uploaded',
    [TimelineAction.FileRemoved]: 'File removed',
    [TimelineAction.TeamUpdated]: 'Team updated',
    [TimelineAction.PaymentRecorded]: 'Payment recorded',
    [TimelineAction.NotesUpdated]: 'Notes updated',
  };
  return labels[action] ?? action;
}

// ── Local type for Doctor in team card ──
interface Doctor {
  id: string;
  name: string;
  specialty?: { id: string; name: string } | null;
}
