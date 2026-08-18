import { useMemo, useState } from 'react';
import { Button, Card, Flex, Image, Popconfirm, Select, Tag, Typography, Upload } from 'antd';
import { DeleteOutlined, DownloadOutlined, EyeOutlined, FileImageOutlined, FilePdfOutlined, FileTextOutlined, FileUnknownOutlined, FolderOpenOutlined, UploadOutlined } from '@ant-design/icons';
import type { OperationFile } from '@/types';
import { resolveMediaUrl } from '@/utils/helpers';
import './ClinicalFilesPanel.scss';

const FILE_TYPES = [
  { value: 'BEFORE_IMAGE', label: 'Before photo', labelAr: 'صورة قبل العملية', group: 'before', icon: <FileImageOutlined /> },
  { value: 'BEFORE_XRAY', label: 'Before X-Ray', labelAr: 'أشعة X-Ray قبل العملية', group: 'before', icon: <FileImageOutlined /> },
  { value: 'BEFORE_MRI', label: 'Before MRI', labelAr: 'رنين قبل العملية', group: 'before', icon: <FileImageOutlined /> },
  { value: 'BEFORE_CT', label: 'Before CT', labelAr: 'أشعة مقطعية قبل العملية', group: 'before', icon: <FileImageOutlined /> },
  { value: 'BEFORE_LAB', label: 'Before lab', labelAr: 'تحاليل قبل العملية', group: 'before', icon: <FileTextOutlined /> },
  { value: 'BEFORE_PDF', label: 'Before document', labelAr: 'مستند قبل العملية', group: 'before', icon: <FilePdfOutlined /> },
  { value: 'AFTER_IMAGE', label: 'After photo', labelAr: 'صورة بعد العملية', group: 'after', icon: <FileImageOutlined /> },
  { value: 'AFTER_REPORT', label: 'After report', labelAr: 'تقرير بعد العملية', group: 'after', icon: <FileTextOutlined /> },
  { value: 'AFTER_PDF', label: 'After document', labelAr: 'مستند بعد العملية', group: 'after', icon: <FilePdfOutlined /> },
  { value: 'AFTER_OTHER', label: 'After file', labelAr: 'ملف بعد العملية', group: 'after', icon: <FileUnknownOutlined /> },
] as const;

const getTypeMeta = (type: string, isAr: boolean) => {
  const meta = FILE_TYPES.find((item) => item.value === type);
  return meta ? { label: isAr ? meta.labelAr : meta.label, icon: meta.icon } : { label: type.replaceAll('_', ' '), icon: <FileUnknownOutlined /> };
};
const isImage = (file: OperationFile) => Boolean(file.mimeType?.startsWith('image/'));

function FileTile({ file, onDelete, isAr }: { file: OperationFile; onDelete: (id: string) => void; isAr: boolean }) {
  const url = resolveMediaUrl(file.fileUrl || file.url || file.filePath || '');
  const meta = getTypeMeta(String(file.fileType), isAr);
  return <Card size="small" className="clinicalFileCard clinicalFileCardV2" bodyStyle={{ padding: 0 }}><div className="clinicalFilePreview clinicalFilePreviewV2">{isImage(file) && url ? <Image src={url} preview={{ mask: <Flex align="center" gap={6}><EyeOutlined />{isAr ? 'معاينة' : 'Preview'}</Flex> }} /> : <span className="clinicalFileIcon clinicalFileTypeIcon">{meta.icon}</span>}</div><Flex vertical gap={6} className="clinicalFileBody"><Typography.Text strong ellipsis title={file.fileName}>{file.fileName}</Typography.Text><Tag className="fileTypeTag" icon={meta.icon}>{meta.label}</Tag><Flex justify="space-between" align="center" gap={4}>{url ? <Button type="link" size="small" icon={<DownloadOutlined />} href={url} target="_blank">{isAr ? 'فتح' : 'Open'}</Button> : <span /> }<Popconfirm title={isAr ? 'حذف هذا الملف؟' : 'Delete this file?'} onConfirm={() => onDelete(file.id)}><Button type="text" danger size="small" icon={<DeleteOutlined />} aria-label={isAr ? 'حذف الملف' : 'Delete file'} /></Popconfirm></Flex></Flex></Card>;
}

function FileGroup({ title, description, files, onDelete, accent, isAr }: { title: string; description: string; files: OperationFile[]; onDelete: (id: string) => void; accent: 'before' | 'after' | 'supporting'; isAr: boolean }) {
  return <section className={`clinicalFileGroup clinicalFileGroup-${accent} clinicalFileGroupV2`}><Flex justify="space-between" align="flex-start" gap={12} className="clinicalGroupHeader"><div><Typography.Title level={4} style={{ margin: 0 }}>{title}</Typography.Title><Typography.Text type="secondary">{description}</Typography.Text></div><Tag>{files.length}</Tag></Flex>{files.length ? <div className="clinicalFileGrid clinicalFileGridV2">{files.map((file) => <FileTile key={file.id} file={file} onDelete={onDelete} isAr={isAr} />)}</div> : <div className="clinicalGroupEmpty clinicalGroupEmptyV2"><FolderOpenOutlined /><Typography.Text type="secondary">{isAr ? 'لا توجد ملفات مضافة بعد' : 'No files added yet'}</Typography.Text></div>}</section>;
}

export default function ClinicalFilesPanel({ files, onUpload, onDelete, uploading, isAr }: { files: OperationFile[]; onUpload: (file: File, fileType: string) => void; onDelete: (id: string) => void; uploading?: boolean; isAr: boolean }) {
  const [uploadType, setUploadType] = useState<string>('BEFORE_IMAGE');
  const selected = FILE_TYPES.find((item) => item.value === uploadType) ?? FILE_TYPES[0];
  const beforeFiles = useMemo(() => files.filter((file) => String(file.fileType).startsWith('BEFORE_')), [files]);
  const afterFiles = useMemo(() => files.filter((file) => String(file.fileType).startsWith('AFTER_')), [files]);
  const beforeImages = beforeFiles.filter(isImage);
  const afterImages = afterFiles.filter(isImage);
  const imagingFiles = files.filter((file) => ['BEFORE_XRAY', 'BEFORE_MRI', 'BEFORE_CT'].includes(String(file.fileType)));
  const labFiles = files.filter((file) => String(file.fileType) === 'BEFORE_LAB');
  const supportingFiles = files.filter((file) => !beforeFiles.includes(file) && !afterFiles.includes(file));
  const upload = (file: File) => { onUpload(file, uploadType); return false; };
  const typeLabel = isAr ? selected.labelAr : selected.label;
  return <Flex vertical gap={18} className="clinicalFilesPanelV2"><Card className="clinicalFilesHero clinicalFilesHeroV2"><Flex vertical gap={14}><Flex justify="space-between" align="flex-start" gap={12} wrap><div className="clinicalFilesIntro"><Flex align="center" gap={10}><span className="clinicalFilesHeroIcon"><FileImageOutlined /></span><div><Typography.Title level={3} style={{ margin: 0 }}>{isAr ? 'الملفات الطبية' : 'Clinical Files'}</Typography.Title><Typography.Text type="secondary">{isAr ? 'كل صور ومستندات الحالة مرتبة من قبل العملية إلى ما بعد العملية.' : 'Keep the case story organized from before surgery through the outcome.'}</Typography.Text></div></Flex></div><Tag color="blue">{files.length} {isAr ? 'ملف' : 'files'}</Tag></Flex><div className="clinicalUploadBar"><Select value={uploadType} onChange={setUploadType} options={FILE_TYPES.map((item) => ({ value: item.value, label: isAr ? item.labelAr : item.label }))} className="clinicalUploadType" /><Upload showUploadList={false} beforeUpload={upload} accept="image/*,.pdf,.doc,.docx"><Button type="primary" icon={<UploadOutlined />} loading={uploading}>{isAr ? `رفع ${typeLabel}` : `Upload ${typeLabel}`}</Button></Upload></div></Flex></Card><FileGroup title={isAr ? 'قبل العملية' : 'Before Surgery'} description={isAr ? 'الصور الأساسية للحالة قبل التدخل.' : 'Baseline clinical photos and pre-operative evidence.'} files={beforeImages} onDelete={onDelete} accent="before" isAr={isAr} /><FileGroup title={isAr ? 'بعد العملية' : 'After Surgery'} description={isAr ? 'صور النتائج والمتابعة المبكرة بعد العملية.' : 'Outcome photos and early post-operative documentation.'} files={afterImages} onDelete={onDelete} accent="after" isAr={isAr} /><Flex gap={16} wrap><div className="clinicalFileColumn"><FileGroup title={isAr ? 'الأشعة' : 'Imaging'} description={isAr ? 'X-Ray و MRI و CT.' : 'X-Ray, MRI and CT studies.'} files={imagingFiles} onDelete={onDelete} accent="supporting" isAr={isAr} /></div><div className="clinicalFileColumn"><FileGroup title={isAr ? 'التحاليل' : 'Lab Results'} description={isAr ? 'التحاليل والنتائج المعملية.' : 'Laboratory results and analyses.'} files={labFiles} onDelete={onDelete} accent="supporting" isAr={isAr} /></div></Flex><FileGroup title={isAr ? 'المستندات والملفات الأخرى' : 'Documents & Other Files'} description={isAr ? 'التقارير والمستندات الداعمة للحالة.' : 'Reports and supporting case documents.'} files={supportingFiles} onDelete={onDelete} accent="supporting" isAr={isAr} /></Flex>;
}
