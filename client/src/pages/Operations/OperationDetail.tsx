import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Card, Descriptions, Empty, Flex, Popconfirm, Select, Space, Spin, Tabs, Tag, Timeline, Typography, Upload, message } from 'antd';
import { ArrowLeftOutlined, BankOutlined, CalendarOutlined, ClockCircleOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, FileImageOutlined, TeamOutlined, UploadOutlined, DollarOutlined, HistoryOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import { formatCurrency, formatOperationDate, formatTime, getInitials, getSpecialtyLabel, getStatusColor, resolveMediaUrl } from '@/utils/helpers';
import { OPERATION_STATUSES } from '@/utils/constants';
import { OperationStatus, type Operation, type OperationFile, type Doctor, type Nurse } from '@/types';
import { getApiErrorMessage } from '@/utils/apiValidationErrors';
import CostBreakdownCard from './CostBreakdownCard';
import './OperationDetail.scss';

function StaffChip({ name, subtitle }: { name: string; subtitle?: string }) {
  return <Flex className="staffChip" align="center" gap={12}><Avatar size={40}>{getInitials(name)}</Avatar><div><Typography.Text strong>{name}</Typography.Text>{subtitle && <div className="staffChipMeta">{subtitle}</div>}</div></Flex>;
}

function FileCard({ file, onDelete }: { file: OperationFile; onDelete: (id: string) => void }) {
  const url = resolveMediaUrl(file.fileUrl || file.url || file.filePath || '');
  const image = file.mimeType?.startsWith('image/');
  return <Card size="small" className="fileCard" hoverable>
    <Flex vertical gap={8}>
      <Flex align="center" gap={8}><FileImageOutlined /><Typography.Text ellipsis>{file.fileName}</Typography.Text></Flex>
      <Tag>{file.fileType}</Tag>
      <Typography.Text type="secondary">{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : '—'}</Typography.Text>
      <Space>
        {url && <Button size="small" icon={<DownloadOutlined />} href={url} target="_blank">Download</Button>}
        {image && url && <Button size="small" href={url} target="_blank">Preview</Button>}
        <Popconfirm title="Delete this file?" onConfirm={() => onDelete(file.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
      </Space>
    </Flex>
  </Card>;
}

export default function OperationDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useQuery({ queryKey: ['operation-detail', id], queryFn: () => operationService.getById(id!), enabled: Boolean(id) });
  const operation: Operation | undefined = data?.data?.data;

  const changeStatusMutation = useMutation({ mutationFn: (status: OperationStatus) => operationService.changeStatus(id!, status), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }); messageApi.success(t('operations.statusUpdated')); }, onError: (e) => messageApi.error(getApiErrorMessage(e, t('common.operationFailed'))) });
  const deleteMutation = useMutation({ mutationFn: () => operationService.delete(id!), onSuccess: () => { messageApi.success(t('operations.operationDeleted')); navigate('/operations'); } });
  const uploadMutation = useMutation({ mutationFn: (fd: FormData) => operationService.uploadFiles(id!, fd), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }) });
  const deleteFileMutation = useMutation({ mutationFn: (fileId: string) => operationService.deleteFile(id!, fileId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }) });

  const doctors = useMemo(() => ((operation?.teamMembers ?? []).map((m) => m.doctor).filter(Boolean) as Doctor[]).length
    ? ((operation?.teamMembers ?? []).map((m) => m.doctor).filter(Boolean) as Doctor[])
    : [operation?.medicalTeam?.primarySurgeon, operation?.medicalTeam?.assistantSurgeon, operation?.medicalTeam?.anesthesiologist, operation?.medicalTeam?.assistantAnesthesia].filter(Boolean) as Doctor[], [operation]);
  const nurses = useMemo(() => (operation?.teamMembers ?? []).map((m) => m.nurse).filter(Boolean) as Nurse[], [operation]);

  if (isLoading) return <div className="operation-detail-page page"><Spin /></div>;
  if (!operation) return <div className="operation-detail-page page"><Empty description={t('common.noData')} /></div>;

  const procedures = operation.procedures?.length ? operation.procedures : [{ id: 'legacy', name: operation.name, catalog: operation.catalog, specialty: operation.specialty, sortOrder: 0 }];
  const files = operation.files ?? [];
  const statusColor = getStatusColor(operation.status);
  const cost = operation.cost;
  const currency = t('common.currency', { defaultValue: 'EGP' });

  const clinicalFiles = <Flex vertical gap={16}>
    <Flex justify="space-between" align="center"><div><Typography.Title level={4} style={{ margin: 0 }}>Clinical Files</Typography.Title><Typography.Text type="secondary">Keep the case documentation close to the operation.</Typography.Text></div><Upload showUploadList={false} beforeUpload={(file) => { const fd = new FormData(); fd.append('file', file); fd.append('fileType', 'BEFORE_IMAGE'); uploadMutation.mutate(fd); return false; }}><Button type="primary" icon={<UploadOutlined />} loading={uploadMutation.isPending}>Upload File</Button></Upload></Flex>
    {files.length ? <div className="fileGrid">{files.map((file) => <FileCard key={file.id} file={file} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} />)}</div> : <Card><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No clinical files yet" /></Card>}
  </Flex>;

  const overview = <Flex vertical gap={16}>
    <Card className="case-hero-card">
      <Flex justify="space-between" align="flex-start" gap={16} wrap>
        <div><Typography.Text type="secondary">Surgical Case</Typography.Text><Typography.Title level={2} style={{ margin: '4px 0 8px' }}>{operation.name}</Typography.Title><Space wrap><Tag color={statusColor}>{OPERATION_STATUSES.find((s) => s.value === operation.status)?.label ?? operation.status}</Tag>{operation.specialty && <Tag>{getSpecialtyLabel(operation.specialty, i18n.language)}</Tag>}</Space></div>
        <Select value={operation.status} onChange={(status) => changeStatusMutation.mutate(status)} loading={changeStatusMutation.isPending} options={OPERATION_STATUSES.map((s) => ({ value: s.value, label: s.label }))} style={{ minWidth: 150 }} />
      </Flex>
      <Flex className="case-meta-grid" gap={12} wrap style={{ marginTop: 24 }}>
        <Card size="small"><Typography.Text type="secondary">Patient</Typography.Text><Typography.Text strong>{operation.patient?.fullName ?? '—'}</Typography.Text></Card>
        <Card size="small"><Typography.Text type="secondary">Hospital</Typography.Text><Typography.Text strong>{operation.hospital?.name ?? '—'}</Typography.Text></Card>
        <Card size="small"><Typography.Text type="secondary">Date & Time</Typography.Text><Typography.Text strong>{formatOperationDate(operation.operationDate)} · {formatTime(operation.operationTime)}</Typography.Text></Card>
        <Card size="small"><Typography.Text type="secondary">Room</Typography.Text><Typography.Text strong>{operation.operationRoom ?? '—'}</Typography.Text></Card>
      </Flex>
    </Card>
    <Flex gap={16} wrap>
      <Card title="Patient" style={{ flex: '1 1 420px' }}><Descriptions column={1} size="small"><Descriptions.Item label="Name">{operation.patient?.fullName ?? '—'}</Descriptions.Item><Descriptions.Item label="Age">{operation.patient?.age ?? '—'}</Descriptions.Item><Descriptions.Item label="Gender">{operation.patient?.gender ?? '—'}</Descriptions.Item><Descriptions.Item label="Mobile">{operation.patient?.mobile ?? '—'}</Descriptions.Item></Descriptions></Card>
      <Card title="Procedure" style={{ flex: '1 1 420px' }}>{procedures.map((procedure, index) => <div key={procedure.id} style={{ marginBottom: 12 }}><Typography.Text strong>{index + 1}. {procedure.name}</Typography.Text></div>)}{operation.diagnosis && <><Typography.Text type="secondary">Diagnosis</Typography.Text><Typography.Paragraph style={{ marginTop: 4 }}>{operation.diagnosis}</Typography.Paragraph></>}</Card>
    </Flex>
  </Flex>;

  const team = <Flex vertical gap={16}><Card title="Doctors" extra={<TeamOutlined />}>{doctors.length ? <div className="staffGrid">{doctors.map((doctor) => <StaffChip key={doctor.id} name={doctor.name} subtitle={(doctor.specialties ?? []).map((s) => s.name).join(', ')} />)}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</Card><Card title="Nursing" >{nurses.length ? <div className="staffGrid">{nurses.map((nurse) => <StaffChip key={nurse.id} name={nurse.name} subtitle={t('nurses.role', { defaultValue: 'Nurse' })} />)}</div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</Card></Flex>;

  const timeline = <Card title="Case Timeline" extra={<HistoryOutlined />}>{operation.timeline?.length ? <Timeline items={operation.timeline.map((item) => ({ children: <div><Typography.Text strong>{item.action}</Typography.Text><div><Typography.Text type="secondary">{item.description ?? ''}</Typography.Text></div><Typography.Text type="secondary">{new Date(item.createdAt).toLocaleString()}</Typography.Text></div> }))} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No timeline events yet" />}</Card>;

  return <div className="operation-detail-page page">
    {contextHolder}
    <div className="pageHeader">
      <Flex align="center" gap={12}><Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations')} /><div><Typography.Title level={3} style={{ margin: 0 }}>{operation.name}</Typography.Title><Typography.Text type="secondary"><BankOutlined /> {operation.hospital?.name ?? '—'} · <CalendarOutlined /> {formatOperationDate(operation.operationDate)} · <ClockCircleOutlined /> {formatTime(operation.operationTime)}</Typography.Text></div></Flex>
      <Space wrap><Button icon={<EditOutlined />} onClick={() => navigate(`/operations/${operation.id}/edit`)}>{t('common.edit')}</Button><Popconfirm title={t('common.delete')} onConfirm={() => deleteMutation.mutate()}><Button danger icon={<DeleteOutlined />}>{t('common.delete')}</Button></Popconfirm></Space>
    </div>
    <Tabs size="large" className="operation-tabs" items={[
      { key: 'overview', label: 'Overview', children: overview },
      { key: 'clinical', label: 'Clinical Files', icon: <FileImageOutlined />, children: clinicalFiles },
      { key: 'team', label: 'Medical Team', icon: <TeamOutlined />, children: team },
      { key: 'financials', label: 'Financials', icon: <DollarOutlined />, children: <CostBreakdownCard operationId={operation.id} cost={cost} currency={currency} /> },
      { key: 'timeline', label: 'Timeline', icon: <HistoryOutlined />, children: timeline },
    ]} />
  </div>;
}
