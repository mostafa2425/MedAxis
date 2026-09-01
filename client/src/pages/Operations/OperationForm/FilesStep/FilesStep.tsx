import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Input, Modal, Popconfirm, Select, Tag, Upload } from 'antd';
import { CloudOutlined, DeleteOutlined, DownloadOutlined, FileImageOutlined, FilePdfOutlined, FileTextOutlined, FolderOpenOutlined, InboxOutlined, LinkOutlined, PictureOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { OperationFile } from '@/types';
import { operationService } from '@/services/operation.service';
import { resolveMediaUrl } from '@/utils/helpers';
import { ACCEPTED_FILE_TYPES } from '../wizardConstants';
import './FilesStep.scss';

type FileCategory = 'before' | 'after' | 'imaging' | 'labs' | 'documents';
type UploadType = 'BEFORE_IMAGE' | 'BEFORE_XRAY' | 'BEFORE_MRI' | 'BEFORE_CT' | 'BEFORE_LAB' | 'BEFORE_PDF' | 'AFTER_IMAGE' | 'AFTER_REPORT' | 'AFTER_PDF' | 'AFTER_OTHER';

export interface FilesStepProps {
  operationId: string | null;
  beforeFiles: OperationFile[];
  afterFiles: OperationFile[];
  onBeforeUpload: (file: File) => Promise<void>;
  onAfterUpload: (file: File) => Promise<void>;
  onAddExternalLink?: (fileType: 'before' | 'after', url: string, fileName: string) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
}

const FILE_TYPES: Array<{ value: UploadType; category: FileCategory; label: string; labelAr: string; icon: React.ReactNode }> = [
  { value: 'BEFORE_IMAGE', category: 'before', label: 'Before photo', labelAr: 'صورة قبل العملية', icon: <PictureOutlined /> },
  { value: 'BEFORE_XRAY', category: 'imaging', label: 'Before X-Ray', labelAr: 'أشعة X-Ray قبل العملية', icon: <FileImageOutlined /> },
  { value: 'BEFORE_MRI', category: 'imaging', label: 'Before MRI', labelAr: 'رنين قبل العملية', icon: <FileImageOutlined /> },
  { value: 'BEFORE_CT', category: 'imaging', label: 'Before CT', labelAr: 'أشعة مقطعية قبل العملية', icon: <FileImageOutlined /> },
  { value: 'BEFORE_LAB', category: 'labs', label: 'Before lab', labelAr: 'تحاليل قبل العملية', icon: <FileTextOutlined /> },
  { value: 'BEFORE_PDF', category: 'documents', label: 'Before document', labelAr: 'مستند قبل العملية', icon: <FilePdfOutlined /> },
  { value: 'AFTER_IMAGE', category: 'after', label: 'After photo', labelAr: 'صورة بعد العملية', icon: <PictureOutlined /> },
  { value: 'AFTER_REPORT', category: 'documents', label: 'After report', labelAr: 'تقرير بعد العملية', icon: <FileTextOutlined /> },
  { value: 'AFTER_PDF', category: 'documents', label: 'After document', labelAr: 'مستند بعد العملية', icon: <FilePdfOutlined /> },
  { value: 'AFTER_OTHER', category: 'documents', label: 'After file', labelAr: 'ملف بعد العملية', icon: <FileTextOutlined /> },
];

const CATEGORY_META: Array<{ key: FileCategory; title: string; titleAr: string; description: string; descriptionAr: string }> = [
  { key: 'before', title: 'Before Surgery', titleAr: 'قبل العملية', description: 'Baseline photos and pre-operative files.', descriptionAr: 'الصور والملفات الأساسية قبل العملية.' },
  { key: 'after', title: 'After Surgery', titleAr: 'بعد العملية', description: 'Outcome and post-operative files.', descriptionAr: 'صور وملفات النتيجة والمتابعة بعد العملية.' },
  { key: 'imaging', title: 'Imaging', titleAr: 'الأشعة', description: 'X-Ray, MRI and CT studies.', descriptionAr: 'X-Ray و MRI و CT.' },
  { key: 'labs', title: 'Lab Results', titleAr: 'التحاليل', description: 'Laboratory results and analyses.', descriptionAr: 'التحاليل والنتائج المعملية.' },
  { key: 'documents', title: 'Reports & Documents', titleAr: 'التقارير والمستندات', description: 'Reports and supporting case documents.', descriptionAr: 'التقارير والمستندات الداعمة للحالة.' },
];

const isExternal = (file: OperationFile) => /^https:\/\/(drive\.google\.com|docs\.google\.com)\//i.test(file.filePath || '');
const metaFor = (type: string) => FILE_TYPES.find((item) => item.value === type) ?? FILE_TYPES[0];
const categoryFor = (type: string): FileCategory => metaFor(type).category;

function FileCard({ file, isAr, onDelete }: { file: OperationFile; isAr: boolean; onDelete: (id: string) => void }) {
  const external = isExternal(file);
  const url = external ? (file.fileUrl || file.url || file.filePath || '') : resolveMediaUrl(file.fileUrl || file.url || '', file.filePath);
  const image = !external && file.mimeType?.startsWith('image/');
  const meta = metaFor(String(file.fileType));
  return (
    <article className="fileCard">
      <div className="fileCardPreview">{image ? <img src={url} alt={file.fileName} className="fileCardImage" /> : <span className="fileCardDocumentIcon">{external ? <CloudOutlined /> : meta.icon}</span>}</div>
      <div className="fileCardBody">
        <div className="fileCardName" title={file.fileName}>{file.fileName}</div>
        <div className="fileCardMeta"><span>{external ? 'Google Drive' : (isAr ? meta.labelAr : meta.label)}</span></div>
        <div className="fileCardActions">
          <Button type="text" size="small" icon={external ? <LinkOutlined /> : <EyeOutlined />} onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} aria-label={isAr ? 'فتح' : 'Open'} />
          {!external && <Button type="text" size="small" icon={<DownloadOutlined />} href={url} target="_blank" aria-label={isAr ? 'تحميل' : 'Download'} />}
          <Popconfirm title={isAr ? 'حذف هذا الملف؟' : 'Delete this file?'} onConfirm={() => onDelete(file.id)} okText={isAr ? 'نعم' : 'Yes'} cancelText={isAr ? 'إلغاء' : 'Cancel'}><Button type="text" danger size="small" icon={<DeleteOutlined />} aria-label={isAr ? 'حذف' : 'Delete'} /></Popconfirm>
        </div>
      </div>
    </article>
  );
}

export default function FilesStep({ operationId, beforeFiles, afterFiles, onBeforeUpload, onAfterUpload, onDeleteFile }: FilesStepProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<UploadType>('BEFORE_IMAGE');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<UploadType>('BEFORE_IMAGE');
  const [fileName, setFileName] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [savingDrive, setSavingDrive] = useState(false);
  const [uploadingType, setUploadingType] = useState<UploadType | null>(null);

  const { data: operationFiles = [] } = useQuery({
    queryKey: ['operation-files-all', operationId],
    queryFn: async () => (await operationService.getById(operationId!)).data.data?.files ?? [],
    enabled: !!operationId,
  });

  const files = operationId ? operationFiles : [...beforeFiles, ...afterFiles];
  const grouped = useMemo(() => {
    const map = new Map<FileCategory, OperationFile[]>(CATEGORY_META.map(({ key }) => [key, []]));
    files.forEach((file) => map.get(categoryFor(String(file.fileType)))?.push(file));
    return map;
  }, [files]);
  const selectedMeta = metaFor(selectedType);

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['operation-files-all', operationId] }),
      queryClient.invalidateQueries({ queryKey: ['operation-files-before', operationId] }),
      queryClient.invalidateQueries({ queryKey: ['operation-files-after', operationId] }),
      queryClient.invalidateQueries({ queryKey: ['operation-detail', operationId] }),
    ]);
  };

  const upload = async (file: File) => {
    if (!operationId) return false;
    setUploadingType(selectedType);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('fileType', selectedType);
      await operationService.uploadFiles(operationId, fd);
      await refresh();
    } finally {
      setUploadingType(null);
    }
    return false;
  };

  const openDriveModal = (type: UploadType) => {
    const meta = metaFor(type);
    setModalType(type);
    setFileName(isAr ? meta.labelAr : meta.label);
    setDriveUrl('');
    setModalOpen(true);
  };

  const saveDriveLink = async () => {
    if (!operationId || !driveUrl.trim() || !fileName.trim()) return;
    setSavingDrive(true);
    try {
      await operationService.addExternalFile(operationId, { url: driveUrl.trim(), fileName: fileName.trim(), fileType: modalType as 'BEFORE_IMAGE' | 'AFTER_IMAGE' });
      await refresh();
      setModalOpen(false);
    } finally {
      setSavingDrive(false);
    }
  };

  if (!operationId) return <Alert type="info" showIcon message={t('operations.step5Files')} description={t('operations.saveFirstToUpload') || 'Save the operation first to upload files.'} />;

  return (
    <div className="stepContent filesStep">
      <div className="filesIntro"><div className="filesIntroIcon"><FileImageOutlined /></div><div><h2>{isAr ? 'الملفات الطبية' : 'Clinical Files'}</h2><p>{isAr ? 'نظّم صور وتقارير الحالة من قبل العملية إلى ما بعدها.' : 'Keep every case file organized from before surgery through follow-up.'}</p></div><Tag>{files.length} {isAr ? 'ملف' : files.length === 1 ? 'file' : 'files'}</Tag></div>

      <div className="clinicalUploadBar formClinicalUploadBar">
        <Select value={selectedType} onChange={setSelectedType} options={FILE_TYPES.map((item) => ({ value: item.value, label: isAr ? item.labelAr : item.label }))} className="clinicalUploadType" />
        <Upload showUploadList={false} beforeUpload={upload} accept={ACCEPTED_FILE_TYPES}><Button type="primary" icon={<InboxOutlined />} loading={uploadingType === selectedType}>{isAr ? `رفع ${selectedMeta.labelAr}` : `Upload ${selectedMeta.label}`}</Button></Upload>
        <Button icon={<CloudOutlined />} onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer')}>{isAr ? 'فتح Google Drive' : 'Open Google Drive'}</Button>
        <Button icon={<LinkOutlined />} onClick={() => openDriveModal(selectedType)}>{isAr ? 'إضافة رابط' : 'Add Drive link'}</Button>
      </div>

      {CATEGORY_META.map((category) => {
        const categoryFiles = grouped.get(category.key) ?? [];
        const defaultType = FILE_TYPES.find((item) => item.category === category.key)?.value ?? 'BEFORE_IMAGE';
        const categoryType = FILE_TYPES.find((item) => item.value === selectedType && item.category === category.key)?.value ?? defaultType;
        return (
          <section key={category.key} className={`fileSection fileSection--${category.key}`}>
            <div className="fileSectionHeader"><div className="fileSectionHeading"><div className="fileSectionIcon">{category.key === 'imaging' ? <FileImageOutlined /> : category.key === 'documents' ? <FilePdfOutlined /> : category.key === 'labs' ? <FileTextOutlined /> : <PictureOutlined />}</div><div><div className="fileSectionTitle">{isAr ? category.titleAr : category.title}</div><div className="fileSectionSubtitle">{isAr ? category.descriptionAr : category.description}</div></div></div><Tag>{categoryFiles.length}</Tag></div>
            {categoryFiles.length ? <div className="fileGallery">{categoryFiles.map((file) => <FileCard key={file.id} file={file} isAr={isAr} onDelete={onDeleteFile} />)}</div> : <div className="clinicalGroupEmpty clinicalGroupEmptyV2 compactEmpty"><FolderOpenOutlined /><span>{isAr ? 'لا توجد ملفات مضافة بعد' : 'No files added yet'}</span></div>}
            <div className="sectionFileActions"><Select value={categoryType} onChange={setSelectedType} options={FILE_TYPES.filter((item) => item.category === category.key).map((item) => ({ value: item.value, label: isAr ? item.labelAr : item.label }))} /><Upload showUploadList={false} beforeUpload={upload} accept={ACCEPTED_FILE_TYPES}><Button icon={<InboxOutlined />} loading={uploadingType !== null && FILE_TYPES.some((item) => item.value === uploadingType && item.category === category.key)}>{isAr ? 'رفع ملف' : 'Upload file'}</Button></Upload><Button icon={<LinkOutlined />} onClick={() => openDriveModal(categoryType)}>{isAr ? 'إضافة من Google Drive' : 'Add Google Drive link'}</Button></div>
          </section>
        );
      })}

      <Modal open={modalOpen} title={<span><CloudOutlined /> {isAr ? 'إضافة ملف من Google Drive' : 'Add Google Drive file'}</span>} onCancel={() => !savingDrive && setModalOpen(false)} onOk={saveDriveLink} okText={isAr ? 'إضافة الملف' : 'Add file'} cancelText={isAr ? 'إلغاء' : 'Cancel'} confirmLoading={savingDrive} destroyOnHidden>
        <div className="externalLinkForm">
          <div className="driveModalType"><span>{isAr ? 'نوع الملف' : 'File type'}</span><Tag icon={metaFor(modalType).icon}>{isAr ? metaFor(modalType).labelAr : metaFor(modalType).label}</Tag></div>
          <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder={isAr ? 'اسم الملف' : 'File name'} prefix={<FileTextOutlined />} />
          <Input value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} placeholder="https://drive.google.com/..." prefix={<LinkOutlined />} />
          <Button type="default" block icon={<CloudOutlined />} onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer')}>{isAr ? 'فتح Google Drive لاختيار الملف' : 'Open Google Drive to choose the file'}</Button>
          <div className="driveModalHint">{isAr ? 'افتح Drive، انسخ رابط الملف أو المجلد، ثم ارجع هنا والصقه.' : 'Open Drive, copy the file or folder link, then paste it here.'}</div>
        </div>
      </Modal>
    </div>
  );
}
