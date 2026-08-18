import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Card, Descriptions, Empty, Flex, Image, Popconfirm, Select, Space, Spin, Tabs, Tag, Timeline, Typography, Upload, message } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, FileImageOutlined, FileTextOutlined, HistoryOutlined, PhoneOutlined, TeamOutlined, UploadOutlined, DollarOutlined, CheckCircleOutlined, FileAddOutlined, MedicineBoxOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { operationService } from '@/services/operation.service';
import { formatOperationDate, formatTime, getInitials, getSpecialtyLabel, getStatusColor, resolveMediaUrl } from '@/utils/helpers';
import { OPERATION_STATUSES } from '@/utils/constants';
import { OperationStatus, type Operation, type OperationFile, type Doctor, type Nurse } from '@/types';
import { getApiErrorMessage } from '@/utils/apiValidationErrors';
import CostBreakdownCard from './CostBreakdownCard';
import './OperationDetail.scss';

const PHONE_KEYS = ['mobile', 'phone', 'phoneNumber'] as const;
const getPhone = (person?: Partial<Doctor & Nurse> | null) => person ? PHONE_KEYS.map((key) => person[key as keyof typeof person] as string | undefined).find(Boolean) : undefined;
const normalizePhone = (value: string) => value.replace(/[^\d+]/g, '');

function PhoneLink({ value }: { value?: string | null }) {
  if (!value) return <Typography.Text type="secondary">—</Typography.Text>;
  return <Button type="link" size="small" className="phoneLink" icon={<PhoneOutlined />} href={`tel:${normalizePhone(value)}`}>{value}</Button>;
}

function StaffCard({ name, role, subtitle, phone }: { name: string; role: string; subtitle?: string; phone?: string }) {
  return <Card size="small" className="medicalStaffCard" bordered><Flex align="center" gap={12}><Avatar size={44} className="medicalStaffAvatar">{getInitials(name)}</Avatar><Flex vertical gap={2} style={{ minWidth: 0, flex: 1 }}><Typography.Text strong ellipsis>{name}</Typography.Text><Tag className="staffRoleTag">{role}</Tag>{subtitle && <Typography.Text type="secondary" ellipsis>{subtitle}</Typography.Text>}{phone && <PhoneLink value={phone} />}</Flex></Flex></Card>;
}

function FileTile({ file, onDelete }: { file: OperationFile; onDelete: (id: string) => void }) {
  const url = resolveMediaUrl(file.fileUrl || file.url || file.filePath || '');
  const image = file.mimeType?.startsWith('image/');
  return <Card size="small" className="clinicalFileCard" bodyStyle={{ padding: 0 }}><div className="clinicalFilePreview">{image && url ? <Image src={url} preview={{ mask: <Flex align="center" gap={6}><EyeOutlined />Preview</Flex> }} /> : <FileTextOutlined className="clinicalFileIcon" />}</div><Flex vertical gap={4} className="clinicalFileBody"><Typography.Text strong ellipsis title={file.fileName}>{file.fileName}</Typography.Text><Tag className="fileTypeTag">{file.fileType}</Tag><Flex justify="space-between" align="center">{url ? <Button type="link" size="small" icon={<DownloadOutlined />} href={url} target="_blank">Open</Button> : <span /> }<Popconfirm title="Delete this file?" onConfirm={() => onDelete(file.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} /></Popconfirm></Flex></Flex></Card>;
}

function FileGroup({ title, description, files, onDelete, accent }: { title: string; description: string; files: OperationFile[]; onDelete: (id: string) => void; accent: 'before' | 'after' | 'other' }) {
  return <section className={`clinicalFileGroup clinicalFileGroup-${accent}`}><Flex justify="space-between" align="end" gap={12} className="clinicalGroupHeader"><div><Typography.Title level={4} style={{ margin: 0 }}>{title}</Typography.Title><Typography.Text type="secondary">{description}</Typography.Text></div><Tag>{files.length}</Tag></Flex>{files.length ? <div className="clinicalFileGrid">{files.map((file) => <FileTile key={file.id} file={file} onDelete={onDelete} />)}</div> : <div className="clinicalGroupEmpty"><FileImageOutlined /><Typography.Text type="secondary">No files added yet</Typography.Text></div>}</section>;
}

function timelineIcon(action?: string | null, description?: string | null) {
  const text = `${action ?? ''} ${description ?? ''}`.toLowerCase();
  if (text.includes('creat') || text.includes('case') || text.includes('patient')) return <FileAddOutlined />;
  if (text.includes('file') || text.includes('upload') || text.includes('document') || text.includes('image')) return <FileImageOutlined />;
  if (text.includes('team') || text.includes('doctor') || text.includes('nurse')) return <TeamOutlined />;
  if (text.includes('status') || text.includes('complete') || text.includes('finish')) return <CheckCircleOutlined />;
  if (text.includes('operation') || text.includes('surgery') || text.includes('procedure')) return <MedicineBoxOutlined />;
  if (text.includes('patient')) return <UserOutlined />;
  return <ClockCircleOutlined />;
}

export default function OperationDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [uploadType, setUploadType] = useState('BEFORE_IMAGE');
  const { data, isLoading } = useQuery({ queryKey: ['operation-detail', id], queryFn: () => operationService.getById(id!), enabled: Boolean(id) });
  const operation: Operation | undefined = data?.data?.data;
  const changeStatusMutation = useMutation({ mutationFn: (status: OperationStatus) => operationService.changeStatus(id!, status), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }); messageApi.success(t('operations.statusUpdated')); }, onError: (e) => messageApi.error(getApiErrorMessage(e, t('common.operationFailed'))) });
  const uploadMutation = useMutation({ mutationFn: (fd: FormData) => operationService.uploadFiles(id!, fd), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }), onError: (e) => messageApi.error(getApiErrorMessage(e, 'Unable to upload file')) });
  const deleteFileMutation = useMutation({ mutationFn: (fileId: string) => operationService.deleteFile(id!, fileId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operation-detail', id] }) });
  const doctors = useMemo(() => { const teamDoctors = (operation?.teamMembers ?? []).map((m) => m.doctor).filter(Boolean) as Doctor[]; return teamDoctors.length ? teamDoctors : [operation?.medicalTeam?.primarySurgeon, operation?.medicalTeam?.assistantSurgeon, operation?.medicalTeam?.anesthesiologist, operation?.medicalTeam?.assistantAnesthesia].filter(Boolean) as Doctor[]; }, [operation]);
  const nurses = useMemo(() => (operation?.teamMembers ?? []).map((m) => m.nurse).filter(Boolean) as Nurse[], [operation]);
  if (isLoading) return <div className="operation-detail-page page"><Spin /></div>;
  if (!operation) return <div className="operation-detail-page page"><Empty description={t('common.noData')} /></div>;
  const procedures = operation.procedures?.length ? operation.procedures : [{ id: 'legacy', name: operation.name, catalog: operation.catalog, specialty: operation.specialty, sortOrder: 0 }];
  const files = operation.files ?? [];
  const beforeFiles = files.filter((file) => file.fileType === 'BEFORE_IMAGE');
  const afterFiles = files.filter((file) => file.fileType === 'AFTER_IMAGE');
  const imagingFiles = files.filter((file) => ['XRAY', 'MRI', 'CT_SCAN', 'ULTRASOUND', 'IMAGING'].includes(String(file.fileType)));
  const labFiles = files.filter((file) => ['LAB_RESULT', 'LAB', 'ANALYSIS'].includes(String(file.fileType)));
  const otherFiles = files.filter((file) => !['BEFORE_IMAGE', 'AFTER_IMAGE', 'XRAY', 'MRI', 'CT_SCAN', 'ULTRASOUND', 'IMAGING', 'LAB_RESULT', 'LAB', 'ANALYSIS'].includes(String(file.fileType)));
  const statusColor = getStatusColor(operation.status);
  const cost = operation.cost;
  const currency = t('common.currency', { defaultValue: 'EGP' });
  const patientPhone = operation.patient?.mobile;
  const upload = (file: File) => { const fd = new FormData(); fd.append('file', file); fd.append('fileType', uploadType); uploadMutation.mutate(fd); return false; };
  const clinicalFiles = <Flex vertical gap={20}><Card className="clinicalFilesHero"><Flex justify="space-between" align="center" gap={12} wrap><div><Typography.Title level={3} style={{ margin: 0 }}>Clinical Files</Typography.Title><Typography.Text type="secondary">Prioritize the case story: before, after, imaging, labs and supporting documents.</Typography.Text></div><Space.Compact><Select value={uploadType} onChange={setUploadType} options={[{ value: 'BEFORE_IMAGE', label: 'Before' }, { value: 'AFTER_IMAGE', label: 'After' }, { value: 'XRAY', label: 'X-Ray' }, { value: 'MRI', label: 'MRI' }, { value: 'CT_SCAN', label: 'CT / Scan' }, { value: 'LAB_RESULT', label: 'Lab Result' }, { value: 'OTHER', label: 'Other' }]} /><Upload showUploadList={false} beforeUpload={upload}><Button type="primary" icon={<UploadOutlined />} loading={uploadMutation.isPending}>Upload</Button></Upload></Space.Compact></Flex></Card><FileGroup title="Before" description="Pre-operative photos and baseline clinical images." files={beforeFiles} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} accent="before" /><FileGroup title="After" description="Post-operative photos and outcome documentation." files={afterFiles} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} accent="after" /><Flex gap={16} wrap><div style={{ flex: '1 1 360px' }}><FileGroup title="Imaging" description="X-Ray, MRI, CT and ultrasound." files={imagingFiles} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} accent="other" /></div><div style={{ flex: '1 1 360px' }}><FileGroup title="Labs & Analyses" description="Lab results and diagnostic reports." files={labFiles} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} accent="other" /></div></Flex><FileGroup title="Other Documents" description="Consent, reports and other supporting files." files={otherFiles} onDelete={(fileId) => deleteFileMutation.mutate(fileId)} accent="other" /></Flex>;
  const overview = <Flex vertical gap={16}><Card className="case-hero-card"><Flex justify="space-between" align="flex-start" gap={16} wrap><div className="caseHeroMain"><Typography.Text type="secondary">Surgical Case</Typography.Text><Typography.Title level={2} style={{ margin: '4px 0 10px' }}>{operation.name}</Typography.Title><Space wrap><Tag color={statusColor}>{OPERATION_STATUSES.find((s) => s.value === operation.status)?.label ?? operation.status}</Tag>{operation.specialty && <Tag color="blue">{getSpecialtyLabel(operation.specialty, i18n.language)}</Tag>}</Space></div><Select className="statusSelect" value={operation.status} onChange={(status) => changeStatusMutation.mutate(status)} loading={changeStatusMutation.isPending} options={OPERATION_STATUSES.map((s) => ({ value: s.value, label: s.label }))} /></Flex><div className="caseMetaGrid"><div className="caseMetaItem"><Typography.Text type="secondary">Patient</Typography.Text><Typography.Text strong>{operation.patient?.fullName ?? '—'}</Typography.Text></div><div className="caseMetaItem"><Typography.Text type="secondary">Hospital</Typography.Text><Typography.Text strong>{operation.hospital?.name ?? '—'}</Typography.Text></div><div className="caseMetaItem caseMetaHighlight"><Typography.Text type="secondary"><CalendarOutlined /> Date & Time</Typography.Text><Tag color="blue">{formatOperationDate(operation.operationDate)} · {formatTime(operation.operationTime)}</Tag></div><div className="caseMetaItem"><Typography.Text type="secondary">Room</Typography.Text><Typography.Text strong>{operation.operationRoom ?? '—'}</Typography.Text></div></div></Card><Flex className="caseActions" justify="space-between" align="center" gap={12} wrap><Button className="backBtn" icon={<ArrowLeftOutlined />} onClick={() => navigate('/operations')}>Back to Operations</Button><Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/operations/${operation.id}/edit`)}>{t('common.edit')}</Button></Flex><Flex gap={16} wrap><Card title="Patient" className="detailInfoCard" style={{ flex: '1 1 420px' }}><Descriptions column={1} size="small"><Descriptions.Item label="Name"><Typography.Text strong>{operation.patient?.fullName ?? '—'}</Typography.Text></Descriptions.Item><Descriptions.Item label="Age">{operation.patient?.age ?? '—'}</Descriptions.Item><Descriptions.Item label="Gender"><Tag color="purple">{operation.patient?.gender ?? '—'}</Tag></Descriptions.Item><Descriptions.Item label="Mobile"><PhoneLink value={patientPhone} /></Descriptions.Item></Descriptions></Card><Card title="Procedure" className="detailInfoCard" style={{ flex: '1 1 420px' }}><Flex vertical gap={10}>{procedures.map((procedure, index) => <div key={procedure.id} className="procedureItem"><Tag color="blue">{index + 1}</Tag><Typography.Text strong>{procedure.name}</Typography.Text></div>)}</Flex>{operation.diagnosis && <div className="diagnosisBlock"><Typography.Text type="secondary">Diagnosis</Typography.Text><Typography.Paragraph style={{ margin: '4px 0 0' }}>{operation.diagnosis}</Typography.Paragraph></div>}</Card></Flex></Flex>;
  const team = <Flex vertical gap={16}><Card title={<Flex align="center" gap={8}><TeamOutlined /> Doctors</Flex>}><div className="medicalTeamGrid">{doctors.length ? doctors.map((doctor) => <StaffCard key={doctor.id} name={doctor.name} role="Doctor" subtitle={(doctor.specialties ?? []).map((s) => s.name).join(', ')} phone={getPhone(doctor)} />) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div></Card><Card title={<Flex align="center" gap={8}><TeamOutlined /> Nursing</Flex>}><div className="medicalTeamGrid">{nurses.length ? nurses.map((nurse) => <StaffCard key={nurse.id} name={nurse.name} role="Nurse" phone={getPhone(nurse)} />) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div></Card></Flex>;
  const timeline = <Card className="case-timeline-card" title={<Flex align="center" gap={8}><HistoryOutlined /> Case Timeline</Flex>} extra={<Tag>{operation.timeline?.length ?? 0} events</Tag>}>{operation.timeline?.length ? <Timeline className="case-timeline" items={operation.timeline.map((item, index) => ({ dot: <span className={`timelineDot ${index === 0 ? 'timelineDotLatest' : ''}`}>{timelineIcon(item.action, item.description)}</span>, children: <div className={`timelineEvent ${index === 0 ? 'timelineEventLatest' : ''}`}><Flex justify="space-between" align="center" gap={12} wrap><Typography.Text strong>{item.action}</Typography.Text>{index === 0 && <Tag color="blue">Latest</Tag>}</Flex>{item.description && <Typography.Paragraph className="timelineDescription">{item.description}</Typography.Paragraph>}<Flex align="center" gap={6} className="timelineTimestamp"><ClockCircleOutlined /><Typography.Text type="secondary">{new Date(item.createdAt).toLocaleString()}</Typography.Text></Flex></div> }))} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No timeline events yet" />}</Card>;
  return <div className="operation-detail-page page">{contextHolder}<Tabs size="large" className="operation-tabs" items={[{ key: 'overview', label: 'Overview', children: overview }, { key: 'clinical', label: 'Clinical Files', icon: <FileImageOutlined />, children: clinicalFiles }, { key: 'team', label: 'Medical Team', icon: <TeamOutlined />, children: team }, { key: 'financials', label: 'Financials', icon: <DollarOutlined />, children: <CostBreakdownCard operationId={operation.id} cost={cost} currency={currency} /> }, { key: 'timeline', label: 'Timeline', icon: <HistoryOutlined />, children: timeline }]} /></div>;
}
