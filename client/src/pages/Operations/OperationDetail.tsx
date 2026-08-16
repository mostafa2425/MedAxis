import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Tag,
  Card,
  Descriptions,
  Empty,
  Spin,
  Popconfirm,
  message,
  Select,
  Avatar,
  Space,
  Typography,
  Upload,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import {
  formatCurrency,
  formatDate,
  formatOperationDate,
  formatTime,
  getStatusColor,
  getInitials,
  getSpecialtyLabel,
  resolveMediaUrl,
  isBeforeFileType,
  isAfterFileType,
} from '@/utils/helpers';
import { OPERATION_STATUSES } from '@/utils/constants';
import { OperationStatus, type Operation, type OperationFile, type Doctor, type Nurse } from '@/types';
import { getApiErrorMessage } from '@/utils/apiValidationErrors';
import './OperationDetail.scss';

function StaffChip({ name, subtitle }: { name: string; subtitle?: string }) {
  return (
    <div className="staffChip">
      <Avatar size={40}>{getInitials(name)}</Avatar>
      <div>
        <div className="staffChipName">{name}</div>
        {subtitle && <div className="staffChipMeta">{subtitle}</div>}
      </div>
    </div>
  );
}

function FileCard({ file, onDelete }: { file: OperationFile; onDelete: (id: string) => void }) {
  const { t } = useTranslation();
  const url = resolveMediaUrl(file.fileUrl || file.url || file.filePath || '');
  return (
    <Card size="small" className="fileCard">
      <div className="fileCardName">{file.fileName}</div>
      <div className="fileCardMeta">{file.fileType}</div>
      <div className="fileCardMeta">{formatDate(file.createdAt)}</div>
      <Space>
        {url && (
          <Button size="small" icon={<DownloadOutlined />} href={url} target="_blank">
            {t('common.download') || 'Download'}
          </Button>
        )}
        <Popconfirm title={t('common.delete')} onConfirm={() => onDelete(file.id)}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    </Card>
  );
}

export default function OperationDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const currency = t('common.currency');

  const { data, isLoading } = useQuery({
    queryKey: ['operation-detail', id],
    queryFn: () => operationService.getById(id!),
    enabled: Boolean(id),
  });

  const operation: Operation | undefined = data?.data?.data;

  const changeStatusMutation = useMutation({
    mutationFn: (status: OperationStatus) => operationService.changeStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-detail', id] });
      messageApi.success(t('operations.statusUpdated'));
    },
    onError: (error) => messageApi.error(getApiErrorMessage(error, t('common.operationFailed'))),
  });

  const deleteMutation = useMutation({
    mutationFn: () => operationService.delete(id!),
    onSuccess: () => {
      messageApi.success(t('operations.operationDeleted'));
      navigate('/operations');
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (fd: FormData) => operationService.uploadFiles(id!, fd),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string) => operationService.deleteFile(id!, fileId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }),
  });

  const doctors = useMemo(() => {
    const fromMembers = (operation?.teamMembers ?? [])
      .map((member) => member.doctor)
      .filter((doctor): doctor is Doctor => Boolean(doctor));
    if (fromMembers.length) return fromMembers;
    return [
      operation?.medicalTeam?.primarySurgeon,
      operation?.medicalTeam?.assistantSurgeon,
      operation?.medicalTeam?.anesthesiologist,
      operation?.medicalTeam?.assistantAnesthesia,
    ].filter((doctor): doctor is Doctor => Boolean(doctor));
  }, [operation]);

  const nurses = useMemo(() => {
    return (operation?.teamMembers ?? [])
      .map((member) => member.nurse)
      .filter((nurse): nurse is Nurse => Boolean(nurse));
  }, [operation]);

  if (isLoading) {
    return (
      <div className="operation-detail-page page">
        <Spin />
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="operation-detail-page page">
        <Empty description={t('common.noData')} />
      </div>
    );
  }

  const statusColor = getStatusColor(operation.status);
  const procedures = operation.procedures?.length
    ? operation.procedures
    : [{ id: 'legacy', name: operation.name, catalog: operation.catalog, specialty: operation.specialty, sortOrder: 0 }];
  const beforeFiles = (operation.files ?? []).filter((file) => isBeforeFileType(file.fileType));
  const afterFiles = (operation.files ?? []).filter((file) => isAfterFileType(file.fileType));
  const cost = operation.cost;

  return (
    <div className="operation-detail-page page">
      {contextHolder}
      <div className="pageHeader">
        <div className="headerLeft">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations')} />
          <div className="headerInfo">
            <h1 className="pageTitle">{operation.name}</h1>
            <div className="headerMeta">
              <Tag color={statusColor}>{OPERATION_STATUSES.find((s) => s.value === operation.status)?.label}</Tag>
              {operation.hospital?.name && <span><BankOutlined /> {operation.hospital.name}</span>}
              <span><CalendarOutlined /> {formatOperationDate(operation.operationDate)}</span>
              <span><ClockCircleOutlined /> {formatTime(operation.operationTime)}</span>
              {operation.duration ? <span>{operation.duration} {t('common.minutes')}</span> : null}
            </div>
          </div>
        </div>
        <Space wrap>
          <Select
            value={operation.status}
            onChange={(status) => changeStatusMutation.mutate(status)}
            options={OPERATION_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
            style={{ minWidth: 140 }}
          />
          <Button icon={<EditOutlined />} onClick={() => navigate(`/operations/${operation.id}/edit`)}>
            {t('common.edit')}
          </Button>
          <Popconfirm title={t('common.delete')} onConfirm={() => deleteMutation.mutate()}>
            <Button danger icon={<DeleteOutlined />}>{t('common.delete')}</Button>
          </Popconfirm>
        </Space>
      </div>

      <div className="detailLayout">
        <div className="detailMain">
          <Card title={t('operations.procedures')}>
            {procedures.map((procedure, index) => (
              <div key={procedure.id} className="procedureRow">
                <Typography.Text strong>
                  {index + 1}. {procedure.name}
                </Typography.Text>
                <div className="procedureMeta">
                  {[procedure.catalog?.specialty, procedure.catalog?.subspecialty, procedure.specialty]
                    .filter(Boolean)
                    .map((item) => getSpecialtyLabel(item as { name: string; nameAr?: string | null }, i18n.language))
                    .filter((value, idx, arr) => arr.indexOf(value) === idx)
                    .join(' → ')}
                </div>
              </div>
            ))}
          </Card>

          {operation.diagnosis && (
            <Card title={t('operations.diagnosis')}>{operation.diagnosis}</Card>
          )}

          <Card title={t('operations.medicalTeam')}>
            <Typography.Text type="secondary">{t('operations.teamDoctors')}</Typography.Text>
            <div className="staffGrid">
              {doctors.length ? doctors.map((doctor) => (
                <StaffChip
                  key={doctor.id}
                  name={doctor.name}
                  subtitle={(doctor.specialties ?? []).map((s) => s.name).join(', ')}
                />
              )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
            <Typography.Text type="secondary">{t('operations.teamNurses')}</Typography.Text>
            <div className="staffGrid">
              {nurses.length ? nurses.map((nurse) => (
                <StaffChip key={nurse.id} name={nurse.name} subtitle={t('nurses.role')} />
              )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
          </Card>

          <Card
            title={t('operations.files')}
            extra={
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  const fd = new FormData();
                  fd.append('file', file);
                  fd.append('fileType', 'BEFORE_IMAGE');
                  uploadMutation.mutate(fd);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} size="small">{t('common.upload')}</Button>
              </Upload>
            }
          >
            <Typography.Text type="secondary">{t('operations.beforeOperation')}</Typography.Text>
            <div className="fileGrid">
              {beforeFiles.map((file) => (
                <FileCard key={file.id} file={file} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} />
              ))}
            </div>
            <Typography.Text type="secondary">{t('operations.afterOperation')}</Typography.Text>
            <div className="fileGrid">
              {afterFiles.map((file) => (
                <FileCard key={file.id} file={file} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} />
              ))}
            </div>
          </Card>

          {operation.notes && (
            <Card title={t('operations.notes')}>{operation.notes}</Card>
          )}
        </div>

        <div className="detailSide">
          <Card title={t('operations.patient')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('patients.fullName')}>{operation.patient?.fullName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label={t('common.age')}>{operation.patient?.age ?? '—'}</Descriptions.Item>
              <Descriptions.Item label={t('common.gender')}>{operation.patient?.gender ?? '—'}</Descriptions.Item>
              <Descriptions.Item label={t('patients.mobile')}>{operation.patient?.mobile ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="ID">{operation.patient?.id ?? '—'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t('operations.hospital')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('operations.hospital')}>{operation.hospital?.name ?? '—'}</Descriptions.Item>
              <Descriptions.Item label={t('operations.operationRoom')}>{operation.operationRoom ?? '—'}</Descriptions.Item>
              <Descriptions.Item label={t('operations.operationDate')}>{formatOperationDate(operation.operationDate)}</Descriptions.Item>
              <Descriptions.Item label={t('operations.operationTime')}>{formatTime(operation.operationTime)}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t('operations.payment')}>
            {cost ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('operations.totalCost')}>{formatCurrency(Number(cost.totalCost), currency)}</Descriptions.Item>
                <Descriptions.Item label={t('operations.paidAmount')}>{formatCurrency(Number(cost.paidAmount), currency)}</Descriptions.Item>
                <Descriptions.Item label={t('operations.remaining')}>
                  {formatCurrency(Number(cost.remainingAmount ?? Number(cost.totalCost) - Number(cost.paidAmount)), currency)}
                </Descriptions.Item>
                <Descriptions.Item label={t('operations.paymentStatus')}>{cost.paymentStatus}</Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('operations.noCost')} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
