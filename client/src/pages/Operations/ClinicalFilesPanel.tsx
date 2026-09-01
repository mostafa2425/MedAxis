import { useMemo, useState } from 'react';
import { Button, Card, Flex, Image, Input, Modal, Popconfirm, Select, Tag, Typography, Upload } from 'antd';
import { CloudOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined, FileAddOutlined, FileImageOutlined, FilePdfOutlined, FileTextOutlined, FileUnknownOutlined, FolderOpenOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons';
import type { OperationFile } from '@/types';
import { operationService } from '@/services/operation.service';
import { resolveMediaUrl } from '@/utils/helpers';
import './ClinicalFilesPanel.scss';

type UploadType = 'BEFORE_IMAGE' | 'BEFORE_XRAY' | 'BEFORE_MRI' | 'BEFORE_CT' | 'BEFORE_LAB' | 'BEFORE_PDF' | 'AFTER_IMAGE' | 'AFTER_REPORT' | 'AFTER_PDF' | 'AFTER_OTHER';
const FILE_TYPES: Array<{ value: UploadType; label: string; labelAr: string; icon: React.ReactNode }> = [
  { value: 'BEFORE_IMAGE', label: 'Before photo', labelAr: 'صورة قبل العملية', icon: <FileImageOutlined /> },
  { value: 'BEFORE_XRAY', label: 'Before X-Ray', labelAr: 'أشعة X-Ray قبل العملية', icon: <FileImageOutlined /> },
  { value: 'BEFORE_MRI', label: 'Before MRI', labelAr: 'رنين قبل العملية', icon: <FileImageOutlined /> },
  { value: 'BEFORE_CT', label: 'Before CT', labelAr: 'أشعة مقطعية قبل العملية', icon: <FileImageOutlined /> },
  { value: 'BEFORE_LAB', label: 'Before lab', labelAr: 'تحاليل قبل العملية', icon: <FileTextOutlined /> },
  { value: 'BEFORE_PDF', label: 'Before document', labelAr: 'مستند قبل العملية', icon: <FilePdfOutlined /> },
  { value: 'AFTER_IMAGE', label: 'After photo', labelAr: 'صورة بعد العملية', icon: <FileImageOutlined /> },
  { value: 'AFTER_REPORT', label: 'After report', labelAr: 'تقرير بعد العملية', icon: <FileTextOutlined /> },
  { value: 'AFTER_PDF', label: 'After document', labelAr: 'مستند بعد العملية', icon: <FilePdfOutlined /> },
  { value: 'AFTER_OTHER', label: 'After file', labelAr: 'ملف بعد العملية', icon: <FileUnknownOutlined /> },
];
const getMeta = (type: string) => FILE_TYPES.find((item) => item.value === type) ?? FILE_TYPES[0];
const isDrive = (file: OperationFile) => /^https:\/\/(drive\.google\.com|docs\.google\.com)\//i.test(file.filePath || '');

function FileTile({ file, onDelete, isAr }: { file: OperationFile; onDelete: (id: string) => void; isAr: boolean }) {
  const drive = isDrive(file);
  const url = drive ? (file.fileUrl || file.url || file.filePath || '') : resolveMediaUrl(file.fileUrl || file.url || '', file.filePath);
  const image = !drive && Boolean(file.mimeType?.startsWith('image/'));
  const meta = getMeta(String(file.fileType));
  return <Card size="small" className="clinicalFileCard clinicalFileCardV2" bodyStyle={{ padding: 0 }}><div className="clinicalFilePreview clinicalFilePreviewV2">{image && url ? <Image src={url} preview={{ mask: <Flex align="center" gap={6}><EyeOutlined />{isAr ? 'معاينة' : 'Preview'}</Flex> }} /> : <span className="clinicalFileIcon clinicalFileTypeIcon">{drive ? <CloudOutlined /> : meta.icon}</span>}</div><Flex vertical gap={6} className="clinicalFileBody"><Typography.Text strong ellipsis title={file.fileName}>{file.fileName}</Typography.Text><Tag className="fileTypeTag" icon={drive ? <CloudOutlined /> : meta.icon}>{drive ? 'Google Drive' : (isAr ? meta.labelAr : meta.label)}</Tag><Flex justify="space-between" align="center" gap={4}>{url ? <Button type="link" size="small" icon={drive ? <LinkOutlined /> : <DownloadOutlined />} href={url} target="_blank">{isAr ? 'فتح' : 'Open'}</Button> : <span /> }<Popconfirm title={isAr ? 'حذف هذا الملف؟' : 'Delete this file?'} onConfirm={() => onDelete(file.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} aria-label={isAr ? 'حذف الملف' : 'Delete file'} /></Popconfirm></Flex></Flex></Card>;
}

function FileGroup({ title, description, files, onDelete, accent, isAr }: { title: string; description: string; files: OperationFile[]; onDelete: (id: string) => void; accent: 'before' | 'after' | 'supporting'; isAr: boolean }) {
  return <section className={`clinicalFileGroup clinicalFileGroup-${accent} clinicalFileGroupV2`}><Flex justify="space-between" align="flex-start" gap={12} className="clinicalGroupHeader"><div><Typography.Title level={4} style={{ margin: 0 }}>{title}</Typography.Title><Typography.Text type="secondary">{description}</Typography.Text></div><Tag>{files.length}</Tag></Flex>{files.length ? <div className="clinicalFileGrid clinicalFileGridV2">{files.map((file) => <FileTile key={file.id} file={file} onDelete={onDelete} isAr={isAr} />)}</div> : <div className="clinicalGroupEmpty clinicalGroupEmptyV2"><FolderOpenOutlined /><Typography.Text type="secondary">{isAr ? 'لا توجد ملفات مضافة بعد' : 'No files added yet'}</Typography.Text></div>}</section>;
}

export default function ClinicalFilesPanel({ files, onUpload, onDelete, uploading, isAr }: { files: OperationFile[]; onUpload: (file: File, fileType: string) => void; onDelete: (id: string) => void; uploading?: boolean; isAr: boolean }) {
  const [uploadType, setUploadType] = useState<UploadType>('BEFORE_IMAGE');
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [driveType, setDriveType] = useState<UploadType>('BEFORE_IMAGE');
  const [driveName, setDriveName] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [driveSaving, setDriveSaving] = useState(false);
  const beforeFiles = useMemo(() => files.filter((file) => String(file.fileType).startsWith('BEFORE_')), [files]);
  const afterFiles = useMemo(() => files.filter((file) => String(file.fileType).startsWith('AFTER_')), [files]);
  const beforeImages = beforeFiles.filter((file) => String(file.fileType) === 'BEFORE_IMAGE');
  const afterImages = afterFiles.filter((file) => String(file.fileType) === 'AFTER_IMAGE');
  const imagingFiles = files.filter((file) => ['BEFORE_XRAY', 'BEFORE_MRI', 'BEFORE_CT'].includes(String(file.fileType)));
  const labFiles = files.filter((file) => String(file.fileType) === 'BEFORE_LAB');
  const documentFiles = files.filter((file) => ['BEFORE_PDF', 'AFTER_REPORT', 'AFTER_PDF', 'AFTER_OTHER'].includes(String(file.fileType)));
  const selected = getMeta(uploadType);
  const openDrive = (type: UploadType) => { const meta = getMeta(type); setDriveType(type); setDriveName(isAr ? meta.labelAr : meta.label); setDriveUrl(''); setDriveModalOpen(true); };
  const saveDrive = async () => { if (!driveUrl.trim() || !driveName.trim()) return; setDriveSaving(true); try { await operationService.addExternalFile((files[0]?.operationId) || '', { url: driveUrl.trim(), fileName: driveName.trim(), fileType: driveType as 'BEFORE_IMAGE' | 'AFTER_IMAGE' }); setDriveModalOpen(false); window.location.reload(); } finally { setDriveSaving(false); } };
  const upload = (file: File) => { onUpload(file, uploadType); return false; };
  return <Flex vertical gap={18} className="clinicalFilesPanelV2">
    <Card className="clinicalFilesHero clinicalFilesHeroV2"><Flex vertical gap={14}><Flex justify="space-between" align="flex-start" gap={12} wrap><div className="clinicalFilesIntro"><Flex align="center" gap={10}><span className="clinicalFilesHeroIcon"><FileImageOutlined /></span><div><Typography.Title level={3} style={{ margin: 0 }}>{isAr ? 'الملفات الطبية' : 'Clinical Files'}</Typography.Title><Typography.Text type="secondary">{isAr ? 'كل صور ومستندات الحالة مرتبة من قبل العملية إلى ما بعد العملية.' : 'Keep the case story organized from before surgery through the outcome.'}</Typography.Text></div></Flex></div><Tag color="blue">{files.length} {isAr ? 'ملف' : 'files'}</Tag></Flex><div className="clinicalUploadBar"><Select value={uploadType} onChange={setUploadType} options={FILE_TYPES.map((item) => ({ value: item.value, label: isAr ? item.labelAr : item.label }))} className="clinicalUploadType" /><Upload showUploadList={false} beforeUpload={upload} accept="image/*,.pdf,.doc,.docx"><Button type="primary" icon={<UploadOutlined />} loading={uploading}>{isAr ? `رفع ${selected.labelAr}` : `Upload ${selected.label}`}</Button></Upload><Button icon={<CloudOutlined />} onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer')}>{isAr ? 'فتح Google Drive' : 'Open Google Drive'}</Button><Button icon={<LinkOutlined />} onClick={() => openDrive(uploadType)}>{isAr ? 'إضافة رابط Drive' : 'Add Drive link'}</Button></div></Flex></Card>
    <FileGroup title={isAr ? 'قبل العملية' : 'Before Surgery'} description={isAr ? 'الصور الأساسية للحالة قبل التدخل.' : 'Baseline clinical photos and pre-operative photos.'} files={beforeImages} onDelete={onDelete} accent="before" isAr={isAr} />
    <FileGroup title={isAr ? 'بعد العملية' : 'After Surgery'} description={isAr ? 'صور النتائج والمتابعة المبكرة بعد العملية.' : 'Outcome photos and early post-operative photos.'} files={afterImages} onDelete={onDelete} accent="after" isAr={isAr} />
    <Flex gap={16} wrap><div className="clinicalFileColumn"><FileGroup title={isAr ? 'الأشعة' : 'Imaging'} description={isAr ? 'X-Ray و MRI و CT.' : 'X-Ray, MRI and CT studies.'} files={imagingFiles} onDelete={onDelete} accent="supporting" isAr={isAr} /></div><div className="clinicalFileColumn"><FileGroup title={isAr ? 'التحاليل' : 'Lab Results'} description={isAr ? 'التحاليل والنتائج المعملية.' : 'Laboratory results and analyses.'} files={labFiles} onDelete={onDelete} accent="supporting" isAr={isAr} /></div></Flex>
    <FileGroup title={isAr ? 'التقارير والمستندات' : 'Reports & Documents'} description={isAr ? 'التقارير والمستندات الداعمة للحالة.' : 'Reports and supporting case documents.'} files={documentFiles} onDelete={onDelete} accent="supporting" isAr={isAr} />
    <Modal open={driveModalOpen} title={<span><CloudOutlined /> {isAr ? 'إضافة ملف من Google Drive' : 'Add Google Drive file'}</span>} onCancel={() => !driveSaving && setDriveModalOpen(false)} onOk={saveDrive} okText={isAr ? 'إضافة الملف' : 'Add file'} cancelText={isAr ? 'إلغاء' : 'Cancel'} confirmLoading={driveSaving} destroyOnHidden><Flex vertical gap={12}><Flex justify="space-between" align="center" className="driveModalType"><Typography.Text type="secondary">{isAr ? 'نوع الملف' : 'File type'}</Typography.Text><Tag icon={getMeta(driveType).icon}>{isAr ? getMeta(driveType).labelAr : getMeta(driveType).label}</Tag></Flex><Input value={driveName} onChange={(e) => setDriveName(e.target.value)} prefix={<FileAddOutlined />} placeholder={isAr ? 'اسم الملف' : 'File name'} /><Input value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} prefix={<LinkOutlined />} placeholder="https://drive.google.com/..." /><Button block icon={<CloudOutlined />} onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer')}>{isAr ? 'فتح Google Drive لاختيار الملف' : 'Open Google Drive to choose the file'}</Button><Typography.Text type="secondary">{isAr ? 'الاسم مقترح تلقائيًا حسب نوع الملف ويمكنك تعديله.' : 'The name is suggested automatically from the file type and can be edited.'}</Typography.Text></Flex></Modal>
  </Flex>;
}
